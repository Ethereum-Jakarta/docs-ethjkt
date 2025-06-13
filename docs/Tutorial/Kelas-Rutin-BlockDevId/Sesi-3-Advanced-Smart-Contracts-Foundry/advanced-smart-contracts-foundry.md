---
id: sesi-3
title: "Advanced Smart Contracts & Foundry Integration"
sidebar_label: "#3 Advanced Smart Contracts & Foundry"
sidebar_position: 3
description: "Implementasi RBAC, Upgradable Contracts, Governance Token, dan Foundry Framework dengan Tug of War Game dan Team Project."
---

# Sesi 3: Advanced Smart Contracts & Foundry Integration

## Informasi Umum Sesi

**Tanggal**: Hari 3  
**Durasi Total**: 8 jam (09:00 - 16:30)  
**Tema Pembelajaran**: Advanced Patterns & Framework Integration  

Sesi ini mengeksplorasi pola-pola advanced smart contract development, dari Role-Based Access Control hingga Upgradable Contracts, kemudian memperkenalkan Foundry sebagai framework development modern untuk membangun aplikasi yang lebih robust dan scalable.

---

## Jadwal Harian Detail

| Waktu            | Aktivitas                                                     | Tujuan                                                    | Materi & Fokus Utama                                                |
|------------------|---------------------------------------------------------------|-----------------------------------------------------------|---------------------------------------------------------------------|
| 09:00 – 09:30    | Retrospective dan Q&A Session                                   | Review sesi sebelumnya & troubleshooting                 | Diskusi issue, best practices, peer learning                       |
| 09:30 – 10:00    | Kuliah — Role-Based Access Control (RBAC)                    | Memahami sistem permission yang kompleks                 | AccessControl, roles hierarchy, grant/revoke patterns              |
| 10:00 – 11:00    | Kuliah — Upgradable Contracts                                | Memahami proxy patterns untuk contract evolution         | UUPS vs Transparent Proxy, storage layout, upgrade safety          |
| 11:15 – 11:30    | Kuliah — Governance Token Fundamentals                       | Memahami token-based governance                          | Voting mechanisms, proposal lifecycle, delegation                   |
| 11:30 – 12:00    | Foundry Installation & Setup                                 | Menguasai modern development toolkit                     | Forge, Cast, Anvil, testing framework                              |
| 13:30 – 15:00    | **Tug of War Game** — Foundry Integration                    | Praktik development dengan Foundry                       | Smart contract logic, testing, frontend integration                |
| 15:00 – 16:30    | **Team Building & Final Project Prep**                       | Formasi tim untuk challenge final                        | ERC Suite integration, presentation preparation                     |

---

## Retrospective & Q&A Session (09:00 - 09:30)

### Refleksi Pembelajaran Sesi 1-2

**Key Achievements Review**:
- ✅ Smart Contract Fundamentals mastered
- ✅ Modular Architecture implemented  
- ✅ Multi-Signature Wallet deployed
- ✅ Token Suite (ERC-20/721/1155) created

**Common Challenges Identified**:
1. **Gas Optimization**: Banyak yang struggle dengan gas costs
2. **Testing Complexity**: Unit testing untuk complex interactions
3. **Error Handling**: Proper error messages dan edge cases
4. **Security Patterns**: Reentrancy, access control implementation

### Interactive Q&A

**Format**: Open floor untuk questions dari participants

**Typical Questions & Solutions**:

```solidity
// Q: "Bagaimana cara optimize gas untuk batch operations?"
// A: Use storage efficiently, batch similar operations

contract GasOptimizedBatch {
    mapping(address => uint256) public balances;
    
    // Bad: Multiple external calls
    function badBatchTransfer(address[] memory recipients, uint256[] memory amounts) external {
        for (uint i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]); // Multiple external calls
        }
    }
    
    // Good: Single internal batch operation
    function goodBatchTransfer(address[] memory recipients, uint256[] memory amounts) external {
        require(recipients.length == amounts.length, "Array length mismatch");
        
        uint256 totalAmount = 0;
        for (uint i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(balances[msg.sender] >= totalAmount, "Insufficient balance");
        balances[msg.sender] -= totalAmount;
        
        for (uint i = 0; i < recipients.length; i++) {
            balances[recipients[i]] += amounts[i];
        }
    }
}
```

**Troubleshooting Session**:
- Deployment failures analysis
- Contract verification issues
- Network configuration problems
- Testing environment setup

---

## Kuliah — Role-Based Access Control (RBAC) (09:30 - 10:00)

### Evolution dari Simple Ownership

Traditional `Ownable` pattern terbatas untuk aplikasi kompleks. RBAC memberikan granular control untuk different permissions.

#### Comparison: Ownable vs AccessControl

```solidity
// OLD WAY: Single owner
contract SimpleOwnable {
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function criticalFunction() external onlyOwner {
        // Only owner can call
    }
}

// NEW WAY: Role-based access
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleManaged is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        // Only minters can mint
    }
    
    function pause() external onlyRole(PAUSER_ROLE) {
        // Only pausers can pause
    }
}
```

### Campus Governance RBAC Implementation

**Real-World Scenario**: Sistem governance kampus dengan multiple stakeholders

```solidity
contract CampusGovernance is AccessControl {
    // Role hierarchy untuk kampus
    bytes32 public constant RECTOR_ROLE = keccak256("RECTOR_ROLE");
    bytes32 public constant DEAN_ROLE = keccak256("DEAN_ROLE");
    bytes32 public constant DEPARTMENT_HEAD_ROLE = keccak256("DEPARTMENT_HEAD_ROLE");
    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");
    bytes32 public constant STUDENT_REP_ROLE = keccak256("STUDENT_REP_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    // Nested permissions
    bytes32 public constant BUDGET_MANAGER_ROLE = keccak256("BUDGET_MANAGER_ROLE");
    bytes32 public constant CURRICULUM_MANAGER_ROLE = keccak256("CURRICULUM_MANAGER_ROLE");
    
    constructor() {
        // Setup role hierarchy
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        // Role admin relationships
        _setRoleAdmin(DEAN_ROLE, RECTOR_ROLE);
        _setRoleAdmin(DEPARTMENT_HEAD_ROLE, DEAN_ROLE);
        _setRoleAdmin(PROFESSOR_ROLE, DEPARTMENT_HEAD_ROLE);
        _setRoleAdmin(BUDGET_MANAGER_ROLE, TREASURER_ROLE);
    }
    
    // Budget approval system
    function approveBudget(uint256 amount, string memory purpose) 
        external 
        onlyRole(BUDGET_MANAGER_ROLE) 
    {
        if (amount > 1000000) { // > 1M requires rector approval
            require(hasRole(RECTOR_ROLE, msg.sender), "Rector approval required");
        } else if (amount > 100000) { // > 100K requires dean approval
            require(hasRole(DEAN_ROLE, msg.sender), "Dean approval required");
        }
        
        // Process budget approval
        emit BudgetApproved(msg.sender, amount, purpose);
    }
    
    // Curriculum changes
    function updateCurriculum(string memory courseCode, string memory newContent) 
        external 
        onlyRole(CURRICULUM_MANAGER_ROLE) 
    {
        // Only curriculum managers can update
        emit CurriculumUpdated(courseCode, newContent, msg.sender);
    }
    
    // Emergency functions
    function emergencyPause() external {
        require(
            hasRole(RECTOR_ROLE, msg.sender) || 
            hasRole(TREASURER_ROLE, msg.sender),
            "Insufficient permissions"
        );
        
        // Emergency pause logic
    }
}
```

### Dynamic Role Management

**Advanced Pattern**: Roles yang dapat berubah berdasarkan kondisi

```solidity
contract DynamicRoleManager is AccessControl {
    struct StudentInfo {
        bool isEnrolled;
        uint256 gpa; // GPA * 100 (e.g., 350 = 3.5)
        uint256 semester;
        bool isActive;
    }
    
    mapping(address => StudentInfo) public students;
    
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 public constant HONOR_STUDENT_ROLE = keccak256("HONOR_STUDENT_ROLE");
    bytes32 public constant GRADUATE_STUDENT_ROLE = keccak256("GRADUATE_STUDENT_ROLE");
    
    function updateStudentStatus(address student) external onlyRole(DEFAULT_ADMIN_ROLE) {
        StudentInfo memory info = students[student];
        
        // Basic student role
        if (info.isEnrolled && info.isActive) {
            _grantRole(STUDENT_ROLE, student);
        } else {
            _revokeRole(STUDENT_ROLE, student);
        }
        
        // Honor student role (GPA >= 3.5)
        if (info.gpa >= 350 && hasRole(STUDENT_ROLE, student)) {
            _grantRole(HONOR_STUDENT_ROLE, student);
        } else {
            _revokeRole(HONOR_STUDENT_ROLE, student);
        }
        
        // Graduate student role (semester >= 7)
        if (info.semester >= 7 && hasRole(STUDENT_ROLE, student)) {
            _grantRole(GRADUATE_STUDENT_ROLE, student);
        } else {
            _revokeRole(GRADUATE_STUDENT_ROLE, student);
        }
    }
    
    // Privilege based on role
    function accessAdvancedCourses() external onlyRole(HONOR_STUDENT_ROLE) {
        // Only honor students can access
    }
    
    function applyForInternship() external onlyRole(GRADUATE_STUDENT_ROLE) {
        // Only graduate students can apply
    }
}
```

### Multi-Signature dengan RBAC

**Combining Patterns**: Multi-sig + role-based approval

```solidity
contract RoleBasedMultiSig is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 approvalCount;
        mapping(address => bool) approved;
    }
    
    Transaction[] public transactions;
    uint256 public requiredApprovals = 2;
    
    event TransactionProposed(uint256 indexed txId, address indexed proposer);
    event TransactionApproved(uint256 indexed txId, address indexed approver);
    event TransactionExecuted(uint256 indexed txId, address indexed executor);
    
    function proposeTransaction(address to, uint256 value, bytes memory data) 
        external 
        onlyRole(PROPOSER_ROLE) 
        returns (uint256) 
    {
        uint256 txId = transactions.length;
        transactions.push();
        
        Transaction storage newTx = transactions[txId];
        newTx.to = to;
        newTx.value = value;
        newTx.data = data;
        newTx.executed = false;
        newTx.approvalCount = 0;
        
        emit TransactionProposed(txId, msg.sender);
        return txId;
    }
    
    function approveTransaction(uint256 txId) 
        external 
        onlyRole(APPROVER_ROLE) 
    {
        require(txId < transactions.length, "Invalid transaction ID");
        Transaction storage tx = transactions[txId];
        require(!tx.executed, "Transaction already executed");
        require(!tx.approved[msg.sender], "Already approved");
        
        tx.approved[msg.sender] = true;
        tx.approvalCount++;
        
        emit TransactionApproved(txId, msg.sender);
    }
    
    function executeTransaction(uint256 txId) 
        external 
        onlyRole(EXECUTOR_ROLE) 
    {
        Transaction storage tx = transactions[txId];
        require(tx.approvalCount >= requiredApprovals, "Insufficient approvals");
        require(!tx.executed, "Transaction already executed");
        
        tx.executed = true;
        
        (bool success, ) = tx.to.call{value: tx.value}(tx.data);
        require(success, "Transaction execution failed");
        
        emit TransactionExecuted(txId, msg.sender);
    }
}
```

---

## Kuliah — Upgradable Contracts (10:00 - 11:00)

### The Immutability Problem

Smart contracts secara default immutable. Namun, real-world applications memerlukan bug fixes, feature updates, dan optimizations.

#### Why Upgradability Matters

**Real Campus Scenario**:
- **Bug Discovery**: Critical vulnerability ditemukan di production
- **Feature Requests**: Mahasiswa request fitur baru
- **Regulatory Changes**: Perubahan peraturan universitas
- **Gas Optimization**: Optimization untuk reduce costs

### Proxy Patterns Overview

```solidity
// Basic concept: Proxy mengarahkan calls ke Implementation
contract Proxy {
    address public implementation;
    
    fallback() external payable {
        address impl = implementation;
        assembly {
            // Delegate call to implementation
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    function upgrade(address newImplementation) external {
        // Only admin can upgrade
        implementation = newImplementation;
    }
}
```

### Transparent Proxy Pattern

**Characteristics**:
- Admin dan user functions separated
- Proxy admin tidak dapat call implementation functions
- Gas overhead untuk function routing

```solidity
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

// Implementation contract V1
contract CampusCreditV1 is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}

// Implementation contract V2 dengan new features
contract CampusCreditV2 is CampusCreditV1 {
    // New state variables (append only!)
    mapping(address => uint256) public rewardPoints;
    uint256 public rewardRate;
    
    // New function
    function earnRewards(address user, uint256 amount) external onlyOwner {
        rewardPoints[user] += amount * rewardRate;
    }
    
    function setRewardRate(uint256 rate) external onlyOwner {
        rewardRate = rate;
    }
    
    function version() external pure override returns (string memory) {
        return "2.0.0";
    }
}

// Deployment script
contract DeployTransparentProxy {
    function deploy() external {
        // Deploy implementation
        CampusCreditV1 implementation = new CampusCreditV1();
        
        // Deploy proxy admin
        ProxyAdmin proxyAdmin = new ProxyAdmin();
        
        // Deploy proxy
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(implementation),
            address(proxyAdmin),
            abi.encodeWithSelector(
                CampusCreditV1.initialize.selector,
                "Campus Credit",
                "CREDIT"
            )
        );
        
        // Proxy is now ready to use
        CampusCreditV1 campusCredit = CampusCreditV1(address(proxy));
    }
}
```

### UUPS (Universal Upgradeable Proxy Standard)

**Advantages**:
- Lower gas costs (no function routing)
- Implementation contract controls upgrade logic
- More flexible upgrade mechanisms

```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract CampusCreditUUPS is 
    Initializable, 
    ERC20Upgradeable, 
    OwnableUpgradeable, 
    UUPSUpgradeable 
{
    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();
        __UUPSUpgradeable_init();
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // UUPS requires this function
    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyOwner 
    {}
    
    function version() external pure virtual returns (string memory) {
        return "1.0.0";
    }
}

// V2 Implementation dengan upgrade safety
contract CampusCreditUUPSV2 is CampusCreditUUPS {
    mapping(address => uint256) public stakingRewards;
    uint256 public stakingAPY;
    
    function initializeV2(uint256 _stakingAPY) public onlyOwner {
        stakingAPY = _stakingAPY;
    }
    
    function stake(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        stakingRewards[msg.sender] += amount;
    }
    
    function unstake(uint256 amount) external {
        require(stakingRewards[msg.sender] >= amount, "Insufficient staked");
        stakingRewards[msg.sender] -= amount;
        
        // Calculate rewards
        uint256 reward = (amount * stakingAPY) / 10000;
        _mint(msg.sender, amount + reward);
    }
    
    function version() external pure override returns (string memory) {
        return "2.0.0";
    }
}
```

### Storage Layout Considerations

**Critical Rule**: Never change storage layout in upgrades

```solidity
contract BadUpgrade {
    // V1 storage
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    
    // V2 - BAD: Inserting new variable between existing ones
    uint256 public newFeature; // ❌ This breaks storage layout
    mapping(address => uint256) public allowances;
}

contract GoodUpgrade {
    // V1 storage
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public allowances;
    
    // V2 - GOOD: Appending new variables at the end
    uint256 public newFeature; // ✅ Safe to add at the end
    mapping(address => uint256) public newMapping;
}
```

### Upgrade Safety Mechanisms

```solidity
contract SafeUpgrade is UUPSUpgradeable {
    // Version tracking
    uint256 public constant VERSION = 2;
    
    // Upgrade validation
    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyOwner 
    {
        // Validate new implementation
        require(newImplementation != address(0), "Invalid implementation");
        
        // Check version compatibility
        try SafeUpgrade(newImplementation).VERSION() returns (uint256 newVersion) {
            require(newVersion > VERSION, "New version must be higher");
        } catch {
            revert("Version check failed");
        }
    }
    
    // Emergency upgrade pause
    bool public upgradesPaused;
    
    function pauseUpgrades() external onlyOwner {
        upgradesPaused = true;
    }
    
    function unpauseUpgrades() external onlyOwner {
        upgradesPaused = false;
    }
    
    function upgradeTo(address newImplementation) 
        public 
        override 
        onlyProxy 
    {
        require(!upgradesPaused, "Upgrades are paused");
        super.upgradeTo(newImplementation);
    }
}
```

### Deployment & Upgrade Scripts

```javascript
// Foundry script untuk deploy upgradeable contract
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../src/CampusCreditUUPS.sol";

contract DeployUpgradeable is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy implementation
        CampusCreditUUPS implementation = new CampusCreditUUPS();
        
        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeCall(
                CampusCreditUUPS.initialize,
                ("Campus Credit", "CREDIT")
            )
        );
        
        console.log("Implementation deployed at:", address(implementation));
        console.log("Proxy deployed at:", address(proxy));
        
        vm.stopBroadcast();
    }
}

// Upgrade script
contract UpgradeContract is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address proxyAddress = vm.envAddress("PROXY_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy new implementation
        CampusCreditUUPSV2 newImplementation = new CampusCreditUUPSV2();
        
        // Upgrade proxy
        CampusCreditUUPS proxy = CampusCreditUUPS(proxyAddress);
        proxy.upgradeTo(address(newImplementation));
        
        // Initialize V2 features
        CampusCreditUUPSV2(proxyAddress).initializeV2(500); // 5% APY
        
        console.log("Upgraded to V2 at:", address(newImplementation));
        
        vm.stopBroadcast();
    }
}
```

---

## Kuliah — Governance Token Fundamentals (11:15 - 11:30)

### Governance Token Concepts

**Governance Token** memungkinkan token holders untuk participate dalam decision-making process suatu protocol atau organization.

#### Core Components

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract CampusGovernanceToken is ERC20, ERC20Permit, ERC20Votes {
    constructor() 
        ERC20("Campus Governance Token", "CGT") 
        ERC20Permit("Campus Governance Token") 
    {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    // Required overrides
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }
    
    function _mint(address to, uint256 amount) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._mint(to, amount);
    }
    
    function _burn(address account, uint256 amount) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._burn(account, amount);
    }
}
```

### Voting Mechanisms

**Snapshot-based Voting**: Voting power determined at specific block

```solidity
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract CampusGovernor is Governor, GovernorCountingSimple, GovernorVotes {
    constructor(IVotes _token) 
        Governor("Campus Governor") 
        GovernorVotes(_token) 
    {}
    
    function votingDelay() public pure override returns (uint256) {
        return 1 days; // 1 day delay before voting starts
    }
    
    function votingPeriod() public pure override returns (uint256) {
        return 1 weeks; // 1 week voting period
    }
    
    function proposalThreshold() public pure override returns (uint256) {
        return 1000 * 10**18; // 1000 tokens needed to propose
    }
}
```

### Campus Governance Implementation

```solidity
contract CampusDAO {
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 amount; // For budget proposals
        address recipient;
        uint256 deadline;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    IERC20 public governanceToken;
    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens
    uint256 public votingPeriod = 7 days;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    
    function createProposal(
        string memory title,
        string memory description,
        uint256 amount,
        address recipient
    ) external returns (uint256) {
        require(
            governanceToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens to propose"
        );
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.amount = amount;
        proposal.recipient = recipient;
        proposal.deadline = block.timestamp + votingPeriod;
        
        emit ProposalCreated(proposalId, msg.sender, title);
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }
    
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.deadline, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        
        // Execute proposal (e.g., transfer funds)
        if (proposal.amount > 0) {
            payable(proposal.recipient).transfer(proposal.amount);
        }
        
        emit ProposalExecuted(proposalId);
    }
}
```

---

## Foundry Installation & Setup (11:30 - 12:00)

### Installation Process

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
cast --version
anvil --version
```

### Project Structure Setup

```bash
# Create new Foundry project
forge init campus-tug-war
cd campus-tug-war

# Project structure
campus-tug-war/
├── foundry.toml          # Configuration
├── src/                  # Source contracts
│   └── TugOfWar.sol
├── test/                 # Test files
│   └── TugOfWar.t.sol
├── script/               # Deployment scripts
│   └── Deploy.s.sol
└── lib/                  # Dependencies
```

### Essential Foundry Commands

```bash
# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts
forge install foundry-rs/forge-std

# Build contracts
forge build

# Run tests
forge test
forge test -vvv  # Verbose output
forge test --match-test testSpecificFunction

# Coverage
forge coverage

# Gas reporting
forge test --gas-report

# Deploy to local
forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url monad_testnet --broadcast --verify

```
---
## Tug of War Game — Foundry Integration (13:30 - 15:00)

### Game Mechanics Overview

**Tug of War** adalah competitive game di mana dua team berlomba untuk "menarik" rope ke arah mereka dengan staking tokens.

**Game Rules**:
- Players join Team A atau Team B
- Stake tokens untuk increase team's power
- Team dengan total stake terbesar menang
- Winners share prize pool proportionally
- Game duration: fixed time period

### Smart Contract Implementation

Buka Dokumentasi [Monad Tug of War Game](/docs/Tutorial/Monad-Co-Learning-Camp/Foundry/Tug-Of-War-Game/monad-tug-war-game)


### Frontend Integration
Buka Dokumentasi [UI Monad Tug of War Game](/docs/Tutorial/Monad-Co-Learning-Camp/Foundry/Tug-Of-War-Game/ui-monad-tug-war-game)

---

## Team Building & Final Project Prep (15:00 - 16:30)

### Team Formation Strategy

**Random Team Generation** (4 orang per tim):

```javascript
// Team formation script
function createRandomTeams(participants) {
    const shuffled = participants.sort(() => 0.5 - Math.random());
    const teams = [];
    
    for (let i = 0; i < shuffled.length; i += 4) {
        teams.push(shuffled.slice(i, i + 4));
    }
    
    return teams;
}

// Example teams
const participants = [
    "Alice", "Bob", "Charlie", "David", "Eve", "Frank", 
    "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam"
];

const teams = createRandomTeams(participants);
console.log("Teams formed:", teams);
```

### Final Challenge: ERC Suite Integration

**Project Scope**: End-to-end integration dari semua token contracts yang dibuat di sesi sebelumnya.

#### Challenge Requirements

# 🎨 Frontend Dashboard MVP Requirements

## 🎯 **MVP Strategy: 3 Separate Contracts**
- **CampusCredit.sol** - ERC20 Token untuk credits
- **StudentID.sol** - ERC721 Soulbound untuk identity  
- **CourseBadge.sol** - ERC1155 untuk certificates

---

## 🏗️ **Tech Stack Recommendation**

### **Frontend Framework**
```javascript
// Option 1: Next.js 14 (Recommended)
- App Router
- Server Components
- Built-in API routes
- TypeScript support

// Option 2: React + Vite (Faster setup)
- React 18
- Vite for build
- TypeScript
```

### **Web3 Integration**
```javascript
// Core Libraries
- wagmi v2 (React hooks for Ethereum)
- viem (TypeScript Ethereum library)
- RainbowKit (Wallet connection UI)
- @tanstack/react-query (State management)

// Contract Interaction
- Generated TypeScript types from ABIs
- Custom hooks for each contract
```

### **UI Components**
```javascript
// Option 1: Tailwind + Headless UI
- Tailwind CSS for styling
- Headless UI for components
- Lucide React for icons

// Option 2: Shadcn/ui (Recommended)
- Pre-built components
- Tailwind CSS
- Radix UI primitives
```

---

## 📱 **Dashboard Structure**

### **1. Landing Page**
```
/
├── Hero Section
├── Connect Wallet Button
├── Feature Overview
└── Student Login
```

### **2. Student Dashboard**
```
/dashboard
├── Profile Card (StudentID info)
├── Credit Balance & History
├── Course Certificates
├── Quick Actions
└── Recent Activity
```

### **3. Admin Panel**
```
/admin
├── Student Management
├── Course Management  
├── Credit Operations
├── System Analytics
└── Contract Controls
```

---

## 🔧 **Core Features MVP**

### **🎫 1. Student Identity Management**

#### **Profile Display**
```typescript
interface StudentProfile {
  address: string;
  hasStudentID: boolean;
  studentInfo?: {
    nim: string;
    name: string;
    major: string;
    semester: number;
    isActive: boolean;
    expiryDate: Date;
  };
}
```

#### **Key Functions**
- ✅ Check if user has StudentID
- ✅ Display student information
- ✅ Show ID status (active/expired)
- ✅ Renewal notification
- ✅ QR code for verification

#### **UI Components**
```jsx
<StudentIDCard />
<IDStatusBadge />
<RenewalAlert />
<QRCodeGenerator />
```

---

### **💰 2. Credit Management**

#### **Balance Display**
```typescript
interface CreditBalance {
  balance: string;
  dailySpent: string;
  dailyLimit: string;
  lifetimeEarned: string;
  lifetimeSpent: string;
}
```

#### **Key Functions**
- ✅ Real-time balance updates
- ✅ Transaction history
- ✅ Daily spending tracker
- ✅ Merchant payment interface
- ✅ Credit earning history

#### **UI Components**
```jsx
<CreditBalanceCard />
<TransactionHistory />
<SpendingChart />
<PaymentModal />
<DailyLimit />
```

---

### **🏆 3. Course Certificates**

#### **Badge Collection**
```typescript
interface CourseBadge {
  tokenId: string;
  courseCode: string;
  courseName: string;
  grade: number;
  issueDate: Date;
  certificateType: 'course' | 'achievement' | 'event';
  rarity: number;
  transferable: boolean;
}
```

#### **Key Functions**
- ✅ Display all certificates
- ✅ Certificate verification
- ✅ Download/share certificates
- ✅ Achievement showcase
- ✅ Progress tracking

#### **UI Components**
```jsx
<CertificateGallery />
<CertificateCard />
<VerificationModal />
<DownloadButton />
<AchievementShowcase />
```

---

## 🔌 **Integration Architecture**

### **1. Contract Interaction Layer**

#### **Custom Hooks**
```typescript
// CampusCredit hooks
const useCredit = () => {
  const balance = useCreditBalance();
  const transfer = useCreditTransfer();
  const history = useCreditHistory();
  return { balance, transfer, history };
};

// StudentID hooks  
const useStudentID = () => {
  const profile = useStudentProfile();
  const status = useIDStatus();
  const renew = useRenewID();
  return { profile, status, renew };
};

// CourseBadge hooks
const useCourseBadge = () => {
  const badges = useUserBadges();
  const verify = useVerifyBadge();
  const metadata = useBadgeMetadata();
  return { badges, verify, metadata };
};
```

#### **Contract Abstractions**
```typescript
// services/contracts.ts
export class CampusCreditService {
  async getBalance(address: string): Promise<string>
  async transfer(to: string, amount: string): Promise<TransactionReceipt>
  async getTransactionHistory(address: string): Promise<Transaction[]>
}

export class StudentIDService {
  async getStudentInfo(address: string): Promise<StudentInfo>
  async isValidStudent(address: string): Promise<boolean>
  async renewID(tokenId: string): Promise<TransactionReceipt>
}

export class CourseBadgeService {
  async getUserBadges(address: string): Promise<Badge[]>
  async verifyBadge(tokenId: string): Promise<boolean>
  async getBadgeMetadata(tokenId: string): Promise<BadgeMetadata>
}
```

---

### **2. State Management**

#### **Global State Structure**
```typescript
interface AppState {
  user: {
    address: string;
    isConnected: boolean;
    profile: StudentProfile;
  };
  contracts: {
    creditAddress: string;
    studentIDAddress: string;
    courseBadgeAddress: string;
  };
  ui: {
    theme: 'light' | 'dark';
    notifications: Notification[];
    loading: boolean;
  };
}
```

#### **Real-time Updates**
```typescript
// Use wagmi's useWatchContractEvent
const { data: creditTransfers } = useWatchContractEvent({
  address: creditAddress,
  abi: creditABI,
  eventName: 'Transfer',
  args: { from: userAddress },
});
```

---

## 📊 **MVP Dashboard Screens**

### **1. Student Dashboard**
```
┌─────────────────────────────────────┐
│ 🎓 Alex Rahman (2024001)           │
│ Computer Science - Semester 3       │
│ Status: Active | Expires: Dec 2024  │
├─────────────────────────────────────┤
│ 💰 Campus Credits                   │
│ Balance: 1,250 CC                   │
│ Today: 50/200 CC spent              │
│ [Pay Merchant] [View History]       │
├─────────────────────────────────────┤
│ 🏆 My Certificates (5)              │
│ [CS101] [MATH201] [PHYSICS101]      │
│ [View All] [Verify Certificate]     │
├─────────────────────────────────────┤
│ 📈 Recent Activity                  │
│ • Earned 50 CC from CS101           │
│ • Spent 25 CC at Cafeteria          │
│ • Received Achievement Badge        │
└─────────────────────────────────────┘
```

### **2. Admin Panel**
```
┌─────────────────────────────────────┐
│ 📊 System Overview                  │
│ Students: 1,247 | Credits: 125K CC  │
│ Certificates: 2,341 | Active: 98%   │
├─────────────────────────────────────┤
│ 👥 Student Management               │
│ [Issue Student ID] [Renew ID]       │
│ [Deactivate] [Bulk Operations]      │
├─────────────────────────────────────┤
│ 🎓 Course Management                │
│ [Add Course] [Issue Certificate]    │
│ [Batch Issue] [Verify Grades]       │
├─────────────────────────────────────┤
│ 💳 Credit Operations                │
│ [Mint Credits] [Set Limits]         │
│ [Register Merchant] [View Reports]  │
└─────────────────────────────────────┘
```

---

## 🛠️ **Implementation Priority**

### **Phase 1: Core Setup (Week 1)**
1. ✅ Project setup with Next.js + wagmi
2. ✅ Wallet connection with RainbowKit
3. ✅ Contract ABI integration
4. ✅ Basic UI components

### **Phase 2: Student Features (Week 2)**
1. ✅ StudentID profile display
2. ✅ Credit balance and transactions
3. ✅ Certificate gallery
4. ✅ Basic payment flow

### **Phase 3: Admin Features (Week 3)**
1. ✅ Student management interface
2. ✅ Course certificate issuance
3. ✅ Credit operations
4. ✅ System monitoring

### **Phase 4: Polish (Week 4)**
1. ✅ Real-time updates
2. ✅ Error handling
3. ✅ Mobile responsiveness
4. ✅ Performance optimization

---

## 📝 **Development Checklist**

### **Setup**
- [ ] Create Next.js project with TypeScript
- [ ] Install wagmi, viem, RainbowKit
- [ ] Setup Tailwind CSS + Shadcn/ui
- [ ] Configure environment variables
- [ ] Generate contract TypeScript types

### **Core Integration**
- [ ] Implement wallet connection
- [ ] Create contract service classes
- [ ] Build custom hooks for each contract
- [ ] Setup state management
- [ ] Configure real-time event listening

### **UI Components**
- [ ] StudentID profile card
- [ ] Credit balance display
- [ ] Certificate gallery
- [ ] Transaction history
- [ ] Admin management panels

### **Features**
- [ ] Student profile management
- [ ] Credit spending flow
- [ ] Certificate verification
- [ ] Admin operations
- [ ] Error handling & loading states

---

## 🚀 **Quick Start Guide**

### **1. Environment Setup**
```bash
# Create project
npx create-next-app@latest campus-dashboard --typescript --tailwind --app

# Install Web3 dependencies
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query

# Install UI dependencies
npx shadcn-ui@latest init
```

### **2. Contract Integration**
```typescript
// lib/contracts.ts
export const contracts = {
  campusCredit: {
    address: '0x...' as const,
    abi: CampusCreditABI,
  },
  studentID: {
    address: '0x...' as const,
    abi: StudentIDABI,
  },
  courseBadge: {
    address: '0x...' as const,
    abi: CourseBadgeABI,
  },
} as const;
```

### **3. Wagmi Configuration**
```typescript
// lib/wagmi.ts
import { createConfig, http } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [hardhat, sepolia],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(),
  },
});
```

### **4. First Component**
```tsx
// components/StudentProfile.tsx
export function StudentProfile() {
  const { address } = useAccount();
  const { data: studentInfo } = useStudentProfile(address);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {studentInfo ? (
          <div>
            <p>Name: {studentInfo.name}</p>
            <p>NIM: {studentInfo.nim}</p>
            <p>Major: {studentInfo.major}</p>
          </div>
        ) : (
          <p>No Student ID found</p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🎯 **Success Metrics**

### **User Experience**
- ⚡ **Fast**: < 2s page load time
- 📱 **Responsive**: Works on mobile/desktop
- 🔒 **Secure**: Proper wallet integration
- 🎨 **Intuitive**: Clear navigation and actions

### **Technical**
- ✅ **Real-time**: Live contract data updates
- 🔄 **Reliable**: Proper error handling
- 🚀 **Scalable**: Clean architecture
- 📊 **Monitorable**: Usage analytics

---

## 💡 **MVP Launch Features**

### **For Students**
1. Connect wallet and view StudentID
2. Check credit balance and spending
3. View earned certificates
4. Make payments to merchants
5. Basic transaction history

### **For Admins**
1. Issue and manage Student IDs
2. Mint and distribute credits
3. Issue course certificates
4. View system statistics
5. Emergency controls

---


### Presentation Guidelines

**Presentation Format** (10 menit per team):
1. **Demo Live Application** (5 menit)
   - Student registration flow
   - Credit transactions
   - Badge earning dan viewing
   - Admin functionalities

2. **Technical Deep Dive** (3 menit)
   - Architecture decisions
   - Smart contract interactions
   - Frontend integration challenges
   - Gas optimization techniques

3. **Innovation Highlights** (2 menit)
   - Unique features implemented
   - User experience improvements
   - Future roadmap ideas

**Judging Criteria**:
- **Functionality** (30%): All core features working
- **Code Quality** (25%): Clean, well-documented code
- **User Experience** (20%): Intuitive interface design
- **Innovation** (15%): Creative features atau solutions
- **Presentation** (10%): Clear explanation dan demo

### Team Collaboration Tools

**Recommended Stack**:
```json
{
  "smart_contracts": "Foundry + OpenZeppelin or Hardhat + OpenZeppelin",
  "frontend": "Next.js + TypeScript + Tailwind CSS or Vite + React + Typescript",
  "web3_integration": "wagmi + viem",
  "deployment": "Vercel (frontend) + Foundry (contracts)",
  "collaboration": "GitHub"
}
```

**Development Workflow**:
1. **Day 1 (Today)**: Team formation, project planning, task distribution
2. **Weekend**: Development sprint, integration testing
3. **Sunday**: Final testing, presentation preparation, demo rehearsal

### Success Metrics

**Minimum Viable Product (MVP)**:
- ✅ All 3 token contracts deployed dan verified
- ✅ CampusEcosystem integration contract
- ✅ Basic frontend dengan wallet connection
- ✅ Student registration flow working
- ✅ Credit balance display dan basic transactions
- ✅ Badge viewing functionality

**Stretch Goals**:
- 🎯 Advanced UI/UX dengan animations
- 🎯 Real-time notifications
- 🎯 Mobile-responsive design
- 🎯 Admin dashboard untuk management
- 🎯 Analytics dan reporting features
- 🎯 Integration dengan external APIs

---

## Resources & Tools

### Development Resources

**Smart Contract Development**:
- [Foundry Documentation](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts v5](https://docs.openzeppelin.com/contracts/5.x/)
- [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

**Frontend Development**:
- [wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**Testing & Debugging**:
- [Foundry Testing Guide](https://book.getfoundry.sh/forge/tests)
- [Ethereum Development Tools](https://ethereum.org/id/developers/tools/)
- [Tenderly](https://tenderly.co/) - Transaction debugging
- [Hardhat Network](https://hardhat.org/hardhat-network/) - Local development

### Useful Libraries

```bash
# Smart Contract Dependencies
forge install OpenZeppelin/openzeppelin-contracts
forge install foundry-rs/forge-std

# Frontend Dependencies
npm install wagmi viem @tanstack/react-query
npm install @headlessui/react @heroicons/react
npm install zustand
npm install framer-motion  # For animations
npm install react-hot-toast  # For notifications
```

### Code Templates

**Quick Start Commands**:
```bash
# Initialize new Foundry project
forge init my-campus-project
cd my-campus-project

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Create Next.js frontend
npx create-next-app@latest frontend --typescript --tailwind --app

# Run tests
forge test

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url monad_testnet --broadcast --verify
```

---

## Kesimpulan Sesi 3

🚀 **Advanced Smart Contract Mastery Achieved!**

**Today's Accomplishments**:
- 🔐 **RBAC Implementation**: Sophisticated permission systems untuk campus governance
- ⬆️ **Upgradable Contracts**: Future-proof smart contracts dengan proxy patterns
- 🗳️ **Governance Tokens**: Democratic decision-making mechanisms
- 🔨 **Foundry Mastery**: Modern development toolkit untuk testing dan deployment
- 🎮 **Game Development**: Interactive Tug of War game dengan staking mechanics
- 👥 **Team Collaboration**: Final project preparation dengan random team formation

**Technical Skills Acquired**:
- Role-based access control dengan hierarchical permissions
- UUPS vs Transparent proxy pattern comparison
- Storage layout safety untuk contract upgrades
- Foundry testing framework dan deployment scripts
- Complex game mechanics implementation
- Frontend integration dengan real-time updates

**Real-World Applications**:
- **Campus Governance**: Multi-role permission systems
- **Contract Evolution**: Safe upgrade mechanisms
- **Democratic Processes**: Token-based voting systems
- **Interactive Applications**: Gamified staking mechanisms
- **Full-Stack Integration**: End-to-end Web3 applications

**Weekend Challenge Ahead**:
Tim akan mengintegrasikan semua knowledge dari 3 sesi untuk membangun complete campus ecosystem:
- Multi-signature treasury management
- Token-based economy (ERC-20/721/1155)
- Role-based access control
- Upgradable architecture
- Comprehensive frontend dashboard

**Key Learnings**:
1. **Security First**: Always implement proper access controls dan upgrade safety
2. **User Experience**: Web3 UX harus intuitive untuk mainstream adoption
3. **Modularity**: Composable contracts untuk flexibility dan reusability
4. **Testing**: Comprehensive test coverage untuk production readiness
5. **Collaboration**: Team development untuk complex Web3 applications

**Next Steps**: Teams will spend the weekend building their final projects, culminating in presentations that showcase mastery of advanced smart contract development, modern tooling, dan full-stack Web3 integration.

*"Great developers are not just individual contributors—they're force multipliers who enable entire teams to build better software!"* 🌟

---

## Final Project Submission Requirements

### Deliverables Checklist

**📋 Required Submissions**:

1. **GitHub Repository** dengan complete codebase
2. **Live Demo** deployed di testnet
3. **Live Presentation** (max 10 menit)
4. **Technical Documentation** 
5. **User Guide** untuk end users
6. **Reflection Report** dari setiap team member

**📊 Grading Rubric**:

| Criteria | Weight | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|----------|--------|---------------|----------|------------------|----------------------|
| **Functionality** | 30% | All features working perfectly | Most features working | Core features working | Basic functionality only |
| **Code Quality** | 25% | Clean, documented, optimized | Well-structured code | Readable code | Basic code structure |
| **Innovation** | 20% | Highly creative solutions | Some innovative features | Standard implementation | Basic requirements met |
| **UX Design** | 15% | Exceptional user experience | Good user interface | Functional interface | Basic interface |
| **Presentation** | 10% | Engaging, clear demonstration | Good presentation | Clear explanation | Basic demo |

**🏆 Awards Categories**:
- **Best Overall Project**: Most complete dan polished application
- **Most Innovative**: Creative use of blockchain technology
- **Best UX Design**: Most user-friendly interface
- **Technical Excellence**: Best code quality dan architecture
- **People's Choice**: Voted by all participants

Ready to build the future of campus digital ecosystems! 🎓✨
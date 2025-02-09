import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Img: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Networking Opportunities',
    Img: require('@site/static/img/logo-outline.png').default,
    description: (
      <>
        Connect with top blockchain developers, entrepreneurs, and Web3 enthusiasts to grow your Ethereum network.
      </>
    ),
  },
  {
    title: 'Learn from Industry Experts',
    Img: require('@site/static/img/logo-outline.png').default,
    description: (
      <>
       Attend talks and workshops by Ethereum and blockchain leaders to stay updated on Web3 developments.
      </>
    ),
  },
  {
    title: 'Innovation & Building',
    Img: require('@site/static/img/logo-outline.png').default,
    description: (
      <>
        Join the hackathon to create decentralized applications and tackle real-world challenges with Ethereum.
      </>
    ),
  },
];

function Feature({ title, Img, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={Img} className={styles.featureImg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

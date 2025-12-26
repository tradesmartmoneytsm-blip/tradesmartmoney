import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Data Collection',
    description: (
      <>
        Automated scripts collect market data from various sources including
        Dhan.co, NSE, and other financial platforms.
      </>
    ),
  },
  {
    title: 'Real-time Analysis',
    description: (
      <>
        Monitor sector performance, FII/DII activity, and market breadth
        with live updates and historical data tracking.
      </>
    ),
  },
  {
    title: 'Trading Insights',
    description: (
      <>
        Get momentum stock signals, futures analysis, and option chain
        insights to make informed trading decisions.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
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

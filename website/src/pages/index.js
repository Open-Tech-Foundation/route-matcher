import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/Getting Started"
          >
            Getting Started 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <div className={styles.features}>
          <div className={styles.featuresText}>
            <h3>FEATURES</h3>
          </div>
          <ul>
            <li> ✔️ Simple API</li>
            <li> ✔️ Strict parsing</li>
            <li> ✔️ Supports named & unnamed parameters</li>
            <li> ✔️ Supports custom regular experssions</li>
            <li> ✔️ Parameters can be repeated or optional</li>
          </ul>
        </div>
      </main>
    </Layout>
  );
}

import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";

import { routeMatcher } from "@open-tech-world/route-matcher";
import styles from "./styles.module.css";

export default function Tester() {
  const [state, setState] = useState({ route: "", path: "" });
  const [output, setOutput] = useState();
  const [status, setStatus] = useState("Default");

  useEffect(() => {
    if (state.route.length > 0) {
      try {
        const o = routeMatcher(state.route, state.path);
        setOutput(o);
        if (o === null) {
          setStatus("Error");
        } else {
          setStatus("Success");
        }
      } catch (error) {
        console.log(error);
        setOutput(error.message);
        setStatus("Error");
      }
    } else {
      setStatus("Default");
    }
  }, [state]);

  return (
    <Layout title="Tester" description="Test your routes.">
      <div className={styles.tester}>
        <div className={styles.testerForm}>
          <div className={styles.testerFormRow}>
            <label>Route</label>
            <input
              spellCheck={false}
              placeholder="/path/:param"
              type="text"
              onChange={(e) => {
                setState({ ...state, route: e.target.value });
              }}
            />
          </div>
          <div className={styles.testerFormRow}>
            <label>Path</label>
            <input
              spellCheck={false}
              placeholder="/path/value"
              type="text"
              onChange={(e) => {
                setState({ ...state, path: e.target.value });
              }}
            />
          </div>
        </div>

        <div className={styles.output}>
          {status !== "Default" && (
            <pre className={status === "Error" ? styles.error : styles.success}>
              {JSON.stringify(output, null, 4)}
            </pre>
          )}
        </div>
      </div>
    </Layout>
  );
}

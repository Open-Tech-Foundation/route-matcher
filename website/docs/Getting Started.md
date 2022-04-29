---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Installation

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'Yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```shell
npm install @open-tech-world/route-matcher
```

</TabItem>
  <TabItem value="yarn">

```shell
yarn add @open-tech-world/route-matcher
```

  </TabItem>
</Tabs>

## Usage

```ts
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher(route: string, path: string): RouteSegment[] | null;

// Eg: routeMatcher("/path/:param", "/path/value");
```

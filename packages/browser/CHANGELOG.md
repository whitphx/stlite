# @stlite/browser

## 1.0.0

### Major Changes

- [#1837](https://github.com/whitphx/stlite/pull/1837) [`813b89e`](https://github.com/whitphx/stlite/commit/813b89e12eaf11e6522aedd75b57ba7bfb2a8bb4) Thanks [@whitphx](https://github.com/whitphx)! - Rename `mountDocumentStyles` to `disableDocumentStyles` with inverted meaning.

  **Breaking Change:** The `mountDocumentStyles` prop/option has been renamed to `disableDocumentStyles` with inverted logic:
  - Old: `mountDocumentStyles: true` (default) meant document styles were mounted
  - New: `disableDocumentStyles: false` (default) means document styles are mounted

  **Migration:**
  - `mountDocumentStyles={true}` → remove the prop (default behavior)
  - `mountDocumentStyles={false}` → `disableDocumentStyles={true}`

## 0.97.0

### Minor Changes

- [#1821](https://github.com/whitphx/stlite/pull/1821) [`3436a4c`](https://github.com/whitphx/stlite/commit/3436a4ceee1c20ae06534693a0be2b3bc464f13d) Thanks [@whitphx](https://github.com/whitphx)! - Fix ToastContainer to be contained by the app screen region

## 0.96.0

### Minor Changes

- [#1807](https://github.com/whitphx/stlite/pull/1807) [`6f8ed99`](https://github.com/whitphx/stlite/commit/6f8ed99e53191319d6911d67876e5de8178311d6) Thanks [@whitphx](https://github.com/whitphx)! - Fix style structure to provide an option to encapsulate the style in each mounted app

## 0.95.1

### Patch Changes

- [`2722b06`](https://github.com/whitphx/stlite/commit/2722b06dbf7b1c262ddc1bf14f0ae1d74ca11556) Thanks [@whitphx](https://github.com/whitphx)! - Trigger release for https://github.com/whitphx/stlite/pull/1808 (Fix the race condition at the server initialization in SharedWorker mode) and https://github.com/whitphx/stlite/pull/1810 (Hook the task switch to reset the per-app CWD and home dir)

## 0.95.0

### Minor Changes

- [#1786](https://github.com/whitphx/stlite/pull/1786) [`430ee6f`](https://github.com/whitphx/stlite/commit/430ee6f81da90a7706c188872dad6da38941667b) Thanks [@whitphx](https://github.com/whitphx)! - Add API to call micropip.add_mock_package

## 0.94.0

### Minor Changes

- [#1763](https://github.com/whitphx/stlite/pull/1763) [`07538a5`](https://github.com/whitphx/stlite/commit/07538a5dc3652a3f80b57a8ab1739454cbbd86a7) Thanks [@whitphx](https://github.com/whitphx)! - Expose controller.\_kernel as an unstable API

## 0.93.1

### Patch Changes

- [#1754](https://github.com/whitphx/stlite/pull/1754) [`5782557`](https://github.com/whitphx/stlite/commit/5782557ada0f661aadd64ffb7071ec0f148665da) Thanks [@whitphx](https://github.com/whitphx)! - Internal package structure update

## 0.93.0

### Minor Changes

- [#1696](https://github.com/whitphx/stlite/pull/1696) [`7d71211`](https://github.com/whitphx/stlite/commit/7d71211b376e58609e272db288663bf522830457) Thanks [@whitphx](https://github.com/whitphx)! - Use @stlite/react as the foundation instead of depending on @stlite/kernel directly

- [#1696](https://github.com/whitphx/stlite/pull/1696) [`7d71211`](https://github.com/whitphx/stlite/commit/7d71211b376e58609e272db288663bf522830457) Thanks [@whitphx](https://github.com/whitphx)! - Remove `workerType` option from `mount()`

## 0.92.0

### Minor Changes

- [#1748](https://github.com/whitphx/stlite/pull/1748) [`f29abb7`](https://github.com/whitphx/stlite/commit/f29abb755fe5fb20ac0cd8ee2e1b6aa21c99977d) Thanks [@whitphx](https://github.com/whitphx)! - Hashing asset file names

- [#1742](https://github.com/whitphx/stlite/pull/1742) [`a83a1e4`](https://github.com/whitphx/stlite/commit/a83a1e4c14ce6945b9bef5f73233fba679ff9e76) Thanks [@whitphx](https://github.com/whitphx)! - Emit font files separately from the main CSS file to prevent the CSS file from becoming huge

- [#1747](https://github.com/whitphx/stlite/pull/1747) [`5ae4026`](https://github.com/whitphx/stlite/commit/5ae4026061fc33a3342313b27dc2f41bfa65f56a) Thanks [@whitphx](https://github.com/whitphx)! - Emit wasm files separately

## 0.91.2

### Patch Changes

- [#1716](https://github.com/whitphx/stlite/pull/1716) [`ee73e8c`](https://github.com/whitphx/stlite/commit/ee73e8c82d16602b3b72a1ec5d86c356b37b66b9) Thanks [@whitphx](https://github.com/whitphx)! - Update protoc to 26.1

- [#1715](https://github.com/whitphx/stlite/pull/1715) [`6dc03af`](https://github.com/whitphx/stlite/commit/6dc03af5f84964b1adf3ad4112287fe3f9c3c17e) Thanks [@whitphx](https://github.com/whitphx)! - Move ConnectionManager to @stlite/kernel to avoid circular dependency between @stlite/kernel and @streamlit/connection

## 0.91.1

### Patch Changes

- [#1711](https://github.com/whitphx/stlite/pull/1711) [`a97285c`](https://github.com/whitphx/stlite/commit/a97285c82f718d6849965cfcd348f87d7fe8f835) Thanks [@whitphx](https://github.com/whitphx)! - Fix toast callback mechanism

- [#1712](https://github.com/whitphx/stlite/pull/1712) [`306c18c`](https://github.com/whitphx/stlite/commit/306c18cb81d500375c31c6e7ff62ab135ca446ff) Thanks [@whitphx](https://github.com/whitphx)! - Use event-listener-based toasts

## 0.91.0

### Minor Changes

- [#1705](https://github.com/whitphx/stlite/pull/1705) [`ed1a48b`](https://github.com/whitphx/stlite/commit/ed1a48bccfd51dbae1c643baccfa5b7932c25f86) Thanks [@whitphx](https://github.com/whitphx)! - Add runPython() method to the controller object returned from mount()

## 0.90.14

### Patch Changes

- [`4d0858c`](https://github.com/whitphx/stlite/commit/4d0858c7a8d82e29ce44c176aa255c5836522c2f) Thanks [@whitphx](https://github.com/whitphx)! - Trigger release for #1689

## 0.90.13

### Patch Changes

- [#1682](https://github.com/whitphx/stlite/pull/1682) [`e4246cc`](https://github.com/whitphx/stlite/commit/e4246cc6cb297338aeb01b9c0a82f080ddd4fb47) Thanks [@whitphx](https://github.com/whitphx)! - Use vite-plugin-lib-assets to handle the wheel file assets

## 0.90.12

### Patch Changes

- [#1672](https://github.com/whitphx/stlite/pull/1672) [`17f163a`](https://github.com/whitphx/stlite/commit/17f163afa79c03ff10b8d6e6d7c4e3ac1b57e624) Thanks [@whitphx](https://github.com/whitphx)! - Fix README about @stlite/browser preview URL

- [#1670](https://github.com/whitphx/stlite/pull/1670) [`1cd2cc3`](https://github.com/whitphx/stlite/commit/1cd2cc30a186df1e0bb92c6a36a352aa84e4f9cb) Thanks [@whitphx](https://github.com/whitphx)! - Fix release workflow

## 0.90.11

### Patch Changes

- [#1659](https://github.com/whitphx/stlite/pull/1659) [`fe90aad`](https://github.com/whitphx/stlite/commit/fe90aad6092ace0008269f791cfb666342e8841c) Thanks [@whitphx](https://github.com/whitphx)! - Fix artifact attestation verification for the preview deployment of @stlite/browser

- [#1653](https://github.com/whitphx/stlite/pull/1653) [`cfebb68`](https://github.com/whitphx/stlite/commit/cfebb68175008d65ba18faf09a9c3ddfa14d96e6) Thanks [@whitphx](https://github.com/whitphx)! - Serve @stlite/browser on Cloudflare Pages

## 0.90.10

### Patch Changes

- [#1656](https://github.com/whitphx/stlite/pull/1656) [`66c40ed`](https://github.com/whitphx/stlite/commit/66c40edd433b51292df1884bcdeb0b54140076eb) Thanks [@whitphx](https://github.com/whitphx)! - Fix release flow

## 0.90.9

### Patch Changes

- [#1654](https://github.com/whitphx/stlite/pull/1654) [`0663d85`](https://github.com/whitphx/stlite/commit/0663d856138cd3f1db36e86c650bcba724552242) Thanks [@whitphx](https://github.com/whitphx)! - Fix release workflow

## 0.90.8

### Patch Changes

- [#1650](https://github.com/whitphx/stlite/pull/1650) [`9302dbc`](https://github.com/whitphx/stlite/commit/9302dbc7a1618daf93d23499295fbbcf3a61b775) Thanks [@whitphx](https://github.com/whitphx)! - Fix artifact attestation verification steps in the release workflow

## 0.90.7

### Patch Changes

- [#1649](https://github.com/whitphx/stlite/pull/1649) [`59813b9`](https://github.com/whitphx/stlite/commit/59813b98567b29c6526b00c53d90a83e2811d885) Thanks [@whitphx](https://github.com/whitphx)! - Fix GitHub release generation

## 0.90.6

### Patch Changes

- [#1646](https://github.com/whitphx/stlite/pull/1646) [`19bdd4c`](https://github.com/whitphx/stlite/commit/19bdd4c788b4c30c8a181c9291a5b9c5dd6564b8) Thanks [@whitphx](https://github.com/whitphx)! - Fix Changesets release management

## 0.90.5

### Patch Changes

- [#1644](https://github.com/whitphx/stlite/pull/1644) [`53d4e0f`](https://github.com/whitphx/stlite/commit/53d4e0ffd4ca89ba2d907a4c19672ddd64304200) Thanks [@whitphx](https://github.com/whitphx)! - Fix Changeset release management

## 0.90.4

### Patch Changes

- [#1642](https://github.com/whitphx/stlite/pull/1642) [`bf43505`](https://github.com/whitphx/stlite/commit/bf435059821452bbeca84faf3162de6a896e7c98) Thanks [@whitphx](https://github.com/whitphx)! - Fix Changeset release management

## 0.90.3

### Patch Changes

- [#1640](https://github.com/whitphx/stlite/pull/1640) [`6013de2`](https://github.com/whitphx/stlite/commit/6013de2722f747dfbdea4b84263ec42c196f967f) Thanks [@whitphx](https://github.com/whitphx)! - Fix Changesets release workflow

## 0.90.2

### Patch Changes

- [`26bb24f`](https://github.com/whitphx/stlite/commit/26bb24f4b7d96a1339172295baea2d811d7a0ce9) Thanks [@whitphx](https://github.com/whitphx)! - Release management by Changesets

## 0.90.1

### Patch Changes

- [#1630](https://github.com/whitphx/stlite/pull/1630) [`ef83ced`](https://github.com/whitphx/stlite/commit/ef83ced9f3543587007a02be377a8920f919ec00) Thanks [@whitphx](https://github.com/whitphx)! - Introduce Changesets for publishing workflow

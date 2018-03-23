## Change Log by Shopee Lumos

### 2018.3.3-2

- [f1c84c44](https://git.garena.com/shopee-data/lumos-superset/commit/f1c84c44dc5af6218e7358541c81604e5725076b) Fix python 3 sort.
- [b46b0e16](https://git.garena.com/shopee-data/lumos-superset/commit/b46b0e16784889530e5f3f4c5bc7e5fc57f23ff8) Hotfix for `encoding before hashing` problem.

### 2018.3.3-1

- [d818d506](https://git.garena.com/shopee-data/lumos-superset/commit/d818d506342048148a4f6ef2e302e13ec5f22862) Fixed bug for unable to copy dashboard

### 2018.3.3

- [a590e752](https://git.garena.com/shopee-data/lumos-superset/commit/a590e7523039c81ef70db46a02b726fe3837f2c9) Added hotkeys and overlaytrigger to run query.
- [ecdaa454](https://git.garena.com/shopee-data/lumos-superset/commit/ecdaa454b291ed29ba17141ac7a8d58598eae4a1) Change `iterator` to `list`
- [9f54146c](https://git.garena.com/shopee-data/lumos-superset/commit/9f54146cc3b5389564957d75ef8221a12aa16c49) Add a pure js base64 encoding library.
- [9ce470c6](https://git.garena.com/shopee-data/lumos-superset/commit/9ce470c6fcd1ca5fe9bac1618b93893e30aa42b4) bugfix sqllab not sorting according to alphabetical order.
- [e58cb311](https://git.garena.com/shopee-data/lumos-superset/commit/e58cb311725c3beca59a4490cbcc5ea83de4b8f6) Two bugs are fixed in this patch.
- [ac461b31](https://git.garena.com/shopee-data/lumos-superset/commit/ac461b312c38f10d4a91109ee929cbaa3a95ca9d) Added base64 encoding for sql query sent in /superset/sql_json
- [274f778d](https://git.garena.com/shopee-data/lumos-superset/commit/274f778daeb8cd6954ece37892a775889c8189cd) Fixed bug that occurs when downloading pivot tables with hidden columns.
- [4514f08b](https://git.garena.com/shopee-data/lumos-superset/commit/4514f08b5078e0c936930a8cffe63c8ac8ba7822) Fixed bug for unable to save SQL query
- [ce578d50](https://git.garena.com/shopee-data/lumos-superset/commit/ce578d500fd2aed672930acf478d9402c2105b1b) Implement the feature of rotating x lables.
- [6c996c28](https://git.garena.com/shopee-data/lumos-superset/commit/6c996c280a81e1c38f64688f88bc6d5d5cd83f10) Upgrade to Python 3.

### 2018.3.2

- [966a931c](https://git.garena.com/shopee-data/lumos-superset/commit/966a931cb9f0bce05e4c4865894af996e5532d56) Fix the bug of adding sql metric in datasource when creating table from SqlLab.
- [854546c7](https://git.garena.com/shopee-data/lumos-superset/commit/854546c7ba95ccfcaf7a507487bf7d89138663b4) Quickfix of bug when add/edit owner and guests

### 2018.3.1

- [200ceb48](https://git.garena.com/shopee-data/lumos-superset/commit/200ceb4816042c965b12232ab064cbc57b2db392) Fix presto-generated visualisation using invalid syntax for date comparison
- [55614da8](https://git.garena.com/shopee-data/lumos-superset/commit/55614da817b60939473e21b07cc914cb82223abb) Fixed bug for user has no csrf token in profile > edit user
- [f566a7b8](https://git.garena.com/shopee-data/lumos-superset/commit/f566a7b8135d547110549c220c3bab1c024c90ed) Added Function and Coverage Columns to User Data
- [2886ab70](https://git.garena.com/shopee-data/lumos-superset/commit/2886ab70f401a4be894d291ab33e625dc7fdf4ec) Add timeout for CSRF token to 8 hours
- [da615a47](https://git.garena.com/shopee-data/lumos-superset/commit/da615a47acf52c4fade97bb2592ab16fad927df3) Fix the bug of checking in datasource overwriting.
- [9009d82a](https://git.garena.com/shopee-data/lumos-superset/commit/9009d82a149f64e1b7e95e959e9fc9324601bb14) change entrypoint to make sqllab run in a standalone container
- [54c96bd5](https://git.garena.com/shopee-data/lumos-superset/commit/54c96bd5ea83e587451d102ad5efd1633eab2224) Typo fix...

### 2018.1.3-1

- [6e8bd5a3](https://git.garena.com/shopee-data/lumos-superset/commit/6e8bd5a3c7fd029734609b8eb4c28accbe9ad430) Hotfix of making nvd3 charts work well.

### 2018.1.3

- [5bd942ff](https://git.garena.com/shopee-data/lumos-superset/commit/5bd942ff6e158048b1865c4181f9786bcd0e964e) Updated SQL Lab timeout to 300s from 30s
- [eaa68074](https://git.garena.com/shopee-data/lumos-superset/commit/eaa68074b65d4cbeb96802cf4da8dd2b0ae67678) Added wildcard filtering for configuration option.
- [0f24cadf](https://git.garena.com/shopee-data/lumos-superset/commit/0f24cadfba8d845bc2abb3b0d8b4b9a960bd974e) Fix sqllab-created tables incompatbility with Column Configuration Control
- [0b7d41ad](https://git.garena.com/shopee-data/lumos-superset/commit/0b7d41adb3b4b094067ba1984ab81547bf53d782) Fix uploading csv to table failing csv file contains ',' inside a quotation
- [0ab1fdd3](https://git.garena.com/shopee-data/lumos-superset/commit/0ab1fdd3d22f995ffacd87d8399120a3061126c3) Implement feature of customizing x axis.
- [71978f60](https://git.garena.com/shopee-data/lumos-superset/commit/71978f60794378315abbee7b153a4c04d29db14e) Import a script from another branch for docker init.
- [fba80db3](https://git.garena.com/shopee-data/lumos-superset/commit/fba80db35f1d3e9475207c9e3c22ae3d030a9661) Stick python 2 version to 2.7.13.

### 2018.1.2-2

- [9f60ce34](https://git.garena.com/shopee-data/lumos-superset/commit/9f60ce3471df71a99cb161c05962663ec2ed0d27) Hotfix for showing progress bar in table.

### 2018.1.2-1

- [7171cc32](https://git.garena.com/shopee-data/lumos-superset/commit/7171cc326927f8b5afc0ead46b241d557e67182f) Fixed Excel file being wrongly formatted when rows are hidden

### 2018.1.2

- [49160af3](https://git.garena.com/shopee-data/lumos-superset/commit/49160af3312f60771944c14bd4e2fba43b7f62e6) Implement the UI/UX reformation for SqlLab.
- [01c7a6da](https://git.garena.com/shopee-data/lumos-superset/commit/01c7a6daa3cdd2739e0420298e3213be0feffa45) Enabled xls download feature for tables
- [c99441e8](https://git.garena.com/shopee-data/lumos-superset/commit/c99441e816cba8e52969de331d91dfa85ef92f36) Add two time presets in the since and until part.
- [f548e125](https://git.garena.com/shopee-data/lumos-superset/commit/f548e12548b672e8c21953665ccb61353eea2ecf) Implement the feature of showing scrollbar when necessary.
- [2f6ca888](https://git.garena.com/shopee-data/lumos-superset/commit/2f6ca8881efdb13bab8656d650ffa694af390fac) Revert "Added scrollbar to dashboard"
- [e9c80465](https://git.garena.com/shopee-data/lumos-superset/commit/e9c804650dd6f0cf76a4194255f1a9a59b3d6899) Hotfix to change the nav bar label and icon.
- [4cd632d4](https://git.garena.com/shopee-data/lumos-superset/commit/4cd632d4e56b63a742f154a19ca34bf1440040af) Fix the bug of webpack can not detect file change.

### 2018.1.1

- [59e96092](https://git.garena.com/shopee-data/lumos-superset/commit/59e96092f03f9e76895a36fe5cf2a0ed7990f6f9) Implement the feature of showing gradient color in progress bar.
- [03e8cbd2](https://git.garena.com/shopee-data/lumos-superset/commit/03e8cbd2862bb84a982c1fe3c3b5abd9230cadd5) Implement the feature of excluding the rows in progress bar.
- [4f989058](https://git.garena.com/shopee-data/lumos-superset/commit/4f989058e9382ae1895d6aa48bef1d60694b8e9f) Fix the bug of hiding null value on line chart.

### 2017.12.3

- [de21b690](https://git.garena.com/shopee-data/lumos-superset/commit/de21b690b414bcce1951c2f988ada54867d43a17) Enable superset worker for sql lab.
- [9cf836ac](https://git.garena.com/shopee-data/lumos-superset/commit/9cf836ac0c57caf5938e46d46be2f87ab023c38e) Implement the UI/UX reformation.
- [e89f9597](https://git.garena.com/shopee-data/lumos-superset/commit/e89f9597c108e2f2275ce5aadf246573c0688812) Fixed datasource permissions not being created properly on SQL Lab
- [61573264](https://git.garena.com/shopee-data/lumos-superset/commit/61573264c400c7300ce00ae9da71a731474ef26c) Added auto datasource permission creation for vizualization in sqllab
- [1c87dd01](https://git.garena.com/shopee-data/lumos-superset/commit/1c87dd01a8ed339dbe9d1b2f29fd71e87845dbf9) Minor hotfixes for excel download feature,
- [bc16f60d](https://git.garena.com/shopee-data/lumos-superset/commit/bc16f60dfb7c27edbd0726f566a6f7f3f0627f79) Fixed superset using local user time to filter Queries in database
- [99109e9c](https://git.garena.com/shopee-data/lumos-superset/commit/99109e9c08ebb39a7b4272b4bf8eb1a945097814) Added workaround for models.Database to work with Spark SQL
- [8b12cc86](https://git.garena.com/shopee-data/lumos-superset/commit/8b12cc86d7bcb2aed78223abc0047389c8bdac3f) Enabled SQL Lab for Spark
- [f254b906](https://git.garena.com/shopee-data/lumos-superset/commit/f254b90604bb6514331b90c0a03373a0618710a8) Fix being able to select schemas in SQL Lab without proper permission
- [2cec3256](https://git.garena.com/shopee-data/lumos-superset/commit/2cec325644f8058518171eac5c345a8787c143f4) Remove unnecessary `console.log`.
- [f3ba1736](https://git.garena.com/shopee-data/lumos-superset/commit/f3ba17362cde32a94e23edebd4d2e37fcf631ed8) Allowed column config to be applied on finer levels in pivot table
- [eefd8194](https://git.garena.com/shopee-data/lumos-superset/commit/eefd8194cab63b1a20a7c2a90fa92bbcc9b3ea57) Update README
- [a898a2d0](https://git.garena.com/shopee-data/lumos-superset/commit/a898a2d0c4faa4ffa70d86cd0f59117da47f9ab7) Remove unnecessary files.
- [bf1a50c2](https://git.garena.com/shopee-data/lumos-superset/commit/bf1a50c299cd81d90ed051f41bd0872acf10bade) Added xls default freezing behavior to downloaded xlsx files
- [d6c89992](https://git.garena.com/shopee-data/lumos-superset/commit/d6c89992afa9947530610397ab5fc9c6dac0073a) Hotfix for javascript error when exporting table with hidden cells to xls
- [c2dc0bc3](https://git.garena.com/shopee-data/lumos-superset/commit/c2dc0bc3eefb0047de5b1dadb52cf4f3877d3170) Added feature to download pivot table as xls file.

### 2017.12.2

- [446ede64](https://git.garena.com/shopee-data/lumos-superset/commit/446ede6477702f499968ad21660930af3b58e0ed) hotfix to remove the free form in time filter
- [0d0754ce](https://git.garena.com/shopee-data/lumos-superset/commit/0d0754ce8f6db320b8d6b035d8b80ca1d74adfc9) Revert "Allowed column config to be applied on finer levels in pivot table"
- [c881dba3](https://git.garena.com/shopee-data/lumos-superset/commit/c881dba384031bcf326d174509c645b7ad36363e) Revert "Return list of dashboards for admin where user can be guest or owner."

### 2017.12.1

- [60596989](https://git.garena.com/shopee-data/lumos-superset/commit/60596989b1bb53c2c770746d61797e4d83282b24) Updated config to ignore Editor and Guest role when adding new datasource
- [2c6a8658](https://git.garena.com/shopee-data/lumos-superset/commit/2c6a86580c63ee712b29819dcb98d8671f246c1c) Revert "Disable automatically permission add when add sqla table."
- [937ad41d](https://git.garena.com/shopee-data/lumos-superset/commit/937ad41d837043cfd80481a6f5b6645b4827e344) Allowed column config to be applied on finer levels in pivot table
- [4ab5c187](https://git.garena.com/shopee-data/lumos-superset/commit/4ab5c187d3502423452748d00e84c7722bc9417e) Implement the feature of setting y-axis range in the line chart.
- [35d85ec6](https://git.garena.com/shopee-data/lumos-superset/commit/35d85ec6bba0fa76530b5fb1ebe6cdfeb13e3ab7) Disable automatically permission add when add sqla table.

### 2017.11.5-2

- [5cc59f2e](https://git.garena.com/shopee-data/lumos-superset/commit/5cc59f2ef73ce249ca2619a2c46e01a8b3a64f66) Hotfix for correcting `yesterday` in `since`

### 2017.11.5-1

- [584ed436](https://git.garena.com/shopee-data/lumos-superset/commit/584ed436d03dfb0c933afeccb26c2dad383d3eb0) Hotfix for download csv not working with Guest users

### 2017.11.5

- [4dbb4c98](https://git.garena.com/shopee-data/lumos-superset/commit/4dbb4c98bf0413aa030ef9e139ced9c2a857bdaf) Fix the bug of changing background color in table.
- [b4433fcf](https://git.garena.com/shopee-data/lumos-superset/commit/b4433fcf0854e87e3cc29a8eeb7cb08263cf4149) Allowed filter-box to work with webshot
- [72fc49b6](https://git.garena.com/shopee-data/lumos-superset/commit/72fc49b630aaaf4ad0f80a58e88cea20d43d83f5) Allowed filters to be applied to downloaded csv
- [5411f545](https://git.garena.com/shopee-data/lumos-superset/commit/5411f5457de7f1c3cabf36f5c8beb063536d3782) Added default series limit and changed description of series limit
- [852bba24](https://git.garena.com/shopee-data/lumos-superset/commit/852bba242cfa8eac804400f3e40dc5c3538b1fc0) Revert filter box datepicker to upstream

### 2017.11.4

This is a big release, contains two important features, column width resize and
dashboard sharing, both contains many commits:

- Dashboard sharing:
  - [3a6551f9](https://git.garena.com/shopee-data/lumos-superset/commit/3a6551f93a931d6a9810c41ea9d309f28f7d55f0) Small fix to email snapshot button.
  - [89275f05](https://git.garena.com/shopee-data/lumos-superset/commit/89275f0534f3ae6fc48b2891430a25763ee814fc) Return list of dashboards for admin where user can be guest or owner.
  - [e216af00](https://git.garena.com/shopee-data/lumos-superset/commit/e216af00b152e92c53b912dd1c3e3fd0034bde1b) Fix dashboard edit with slices from multiple data sources.
  - [4bc7e6a9](https://git.garena.com/shopee-data/lumos-superset/commit/4bc7e6a9a55d6e5e78e9f1b72ee03cf2add68495) Fix anonymous user in webshot.
  - [bb546858](https://git.garena.com/shopee-data/lumos-superset/commit/bb5468587e6fad29873c9952004cb9c25dd20b85) Show icon icons for guest and read/write icons for owners.
  - [cccb3d45](https://git.garena.com/shopee-data/lumos-superset/commit/cccb3d454a3d67894d3d1f544d30a8be9cf7b116) Remove `ExportMailModal` for slice cells.
  - [f131241b](https://git.garena.com/shopee-data/lumos-superset/commit/f131241bf03bacc3d030e4d10753633053321408) Enable indirect slice data access for dashboard's guest.
  - [3de09f85](https://git.garena.com/shopee-data/lumos-superset/commit/3de09f855d5a9e3ea015faa8524d57d6a646ee3e) Hide clickable buttons for guest user in Dashboard.
  - [9c808a86](https://git.garena.com/shopee-data/lumos-superset/commit/9c808a8673c79fc58fe3e5a0a3c8a1158aff9815) Improve dashboard list filter behavior.
  - [04541471](https://git.garena.com/shopee-data/lumos-superset/commit/045414719a97f9e129c3d082a53b357d1c5bc2b8) Enable dashboard transfer function.
  - [a620a762](https://git.garena.com/shopee-data/lumos-superset/commit/a620a76284aa34a51762b43311fb0f9ec108900f) Return a list of dashboards in which user are owner or guest.
  - [14e6bd5d](https://git.garena.com/shopee-data/lumos-superset/commit/14e6bd5d8d7c97c40d3b9cf78b338f2e7f3339a7) Dig a hole for webshot service to take screenshot.
  - [41c43bc3](https://git.garena.com/shopee-data/lumos-superset/commit/41c43bc32532dda077c9bd46f214aa20d25a24ba) Prefer id over slug for building dashboard URL
  - [77e8a8c9](https://git.garena.com/shopee-data/lumos-superset/commit/77e8a8c90896341a683d5e3b2d8a7867a2df06e8) Show owners instead of creators in dashboard list page.
  - [bdc35f9e](https://git.garena.com/shopee-data/lumos-superset/commit/bdc35f9e2c64697bac50dcf406eb39b4d4e96796) Add guest user to dashboard.

- Column width resize:
  - [9e6dd68b](https://git.garena.com/shopee-data/lumos-superset/commit/9e6dd68b7cf5e5e75abdef9696e83fbc28e8432b) Fix the bug of sorting properly in some situation.
  - [f9976a7e](https://git.garena.com/shopee-data/lumos-superset/commit/f9976a7e6e356eee8863fea46d9278f8c7b6d0d2) Implement the feature of adjusting column width.
  - [11dc0924](https://git.garena.com/shopee-data/lumos-superset/commit/11dc0924a4b499351fb44c8423f20f3ce8a85f07) Implement the feature of adjusting column width.
  - [830ca8e1](https://git.garena.com/shopee-data/lumos-superset/commit/830ca8e19fb512bac40ba16a8e65bdfdfb09a28b) Add the datatable plugin 'colResize' to adjust column width.

- Other small fix
  - [fa8fb27f](https://git.garena.com/shopee-data/lumos-superset/commit/fa8fb27f8b32359c972aaee7ee83dde7127fbcbb) Revert "Fix the bug of showing rows with null value"
  - [d162e668](https://git.garena.com/shopee-data/lumos-superset/commit/d162e6686138f1c14371ecc4fc7bd2594054f272) Fix the bug of showing rows with null value in pivot table.
  - [5e2c537a](https://git.garena.com/shopee-data/lumos-superset/commit/5e2c537a918200456c2686632de52edc7648e335) Fix the bug of barchart total number show properly

### 2017.11.3

- [ea8f75](https://git.garena.com/shopee-data/lumos-superset/commit/ea8f75cdbc77b6db6271959e76d60ae4353a62d3) Fix the bug of making number refresh properly in bar chart.
- [c37129](https://git.garena.com/shopee-data/lumos-superset/commit/c37129ef86b9779f3663807245af3dbcdb4f6bcc) Fix the check method in table view for formatting the non-null value.
- [354834](https://git.garena.com/shopee-data/lumos-superset/commit/3548348ba3e6abfa4dd808cc3db7c9ad99d1256e) Fix the bug of showing blank with null value.
- [d4087d](https://git.garena.com/shopee-data/lumos-superset/commit/d4087d53880384cf047d944e69c99ad99509f49e) Fix filterboxes affecting slices made from other views.
- [41feeb](https://git.garena.com/shopee-data/lumos-superset/commit/41feeb98672353c6a6868fe9406ff3f6db65507a) Reverted filter box related code to upstream
- [dbdbfb](https://git.garena.com/shopee-data/lumos-superset/commit/dbdbfb7f9d87c545787c0f1197b7fa56df7a92c4) Fix the bug of showing `0` for `null` value in pivot table.

### 2017.11.2

- [b07504](https://git.garena.com/shopee-data/lumos-superset/commit/b0750493896adc17bf8d6951e9c5fafbe9598a14) Make the grouped column sorted in numberic way.

### 2017.11.1

- [9fb228](https://git.garena.com/shopee-data/lumos-superset/commit/9fb228287a40ed812ede204533b6b69bf2d43e62) Escape csv filename to safe characters.
- [eb2545](https://git.garena.com/shopee-data/lumos-superset/commit/eb25454f64069c0776b3355c91ee5856da824669) Added cache to download csv feature
- [23e254](https://git.garena.com/shopee-data/lumos-superset/commit/23e254ba44ac810a35f2cac81942d47b9c24e54c) Fix the bug of making the column color config take priority over the row color configuration.
- [817208](https://git.garena.com/shopee-data/lumos-superset/commit/8172086c25ed522c6a42e562d43aab2fa6932c78) Fix invalid options and values caused by column order select in pivot table
- [ff2356](https://git.garena.com/shopee-data/lumos-superset/commit/ff23568991b4319bcc394a58943d6cec93d9401e) Set gunicorn worker timeout via environment variables.
- [096b29](https://git.garena.com/shopee-data/lumos-superset/commit/096b2995f06df82840e69ec8137d94280639dadf) Fix the bug of showing the row and column config in every viz type.

### 2017.10.2

- [8adc71](https://git.garena.com/shopee-data/lumos-superset/commit/8adc714bfd537be4d05e0feed518c9446c3aa0bd) Implemented export dashboard/slice as csv feature
- [efb75f](https://git.garena.com/shopee-data/lumos-superset/commit/efb75fb5a1d9e46379dc2b4fd533764c80069511) Implementated slice duplication upon dashboard duplication

### 2017.10.1

Based on superset
[0.17.5](https://github.com/apache/incubator-superset/commit/4be6bfafaa07695cf47a9a27977855ab30ff87e4),

Start from April, 2017, lumos add following things:

- UI/UX
  - [74dfec](https://git.garena.com/shopee-data/lumos-superset/commit/74dfecabe625dd75ea772919cb43a2bde674e2ab) Add the link of `Developer Notes` under documents.
  - [e4d917](https://git.garena.com/shopee-data/lumos-superset/commit/e4d917ab301c16afb667a41337e19e619d3b4caf) Add links to various google docs in navbar.
- Time selection
  - [d26e62](https://git.garena.com/shopee-data/lumos-superset/commit/d26e62d86ddc96047cd2c89b834c172e85e8199a) Implement the feature of making `since` flexible.
  - [be0a31](https://git.garena.com/shopee-data/lumos-superset/commit/be0a312697e85556f62df1e4f8c0083a4df369ba) Fix the bug of quering last week's data when choose 'Last Monday and 7 days ago'.
- Table and pivot table sort:
  - [789bf7](https://git.garena.com/shopee-data/lumos-superset/commit/789bf7996dad3741a6968508bb6a1593516a9851) Fix the bug of showing whole table in some cases.
  - [cc8fd7](https://git.garena.com/shopee-data/lumos-superset/commit/cc8fd74ce059c3340bae33ea62ed019daf74d257) Sorting in pivot table with multiple group_bY
  - [b96822](https://git.garena.com/shopee-data/lumos-superset/commit/b968222edb95b71ce7d7e0da976ab59523a77afa) Fix the bug of making datatable state permanent
  - [1faf53](https://git.garena.com/shopee-data/lumos-superset/commit/1faf53b94de8dc0386e50211362d35cce795c3f0) Hotfix for saving table as slice bug.
  - [187eef](https://git.garena.com/shopee-data/lumos-superset/commit/187eef74461849e2206bde73a837cc086db7e374) Implement table and pivot table sort.
- Pivot table:
  - [2a1ce0](https://git.garena.com/shopee-data/lumos-superset/commit/2a1ce0d5f07707f701df29c65657a213e11c8f53) Fix metric sorting not working
  - [86be1a](https://git.garena.com/shopee-data/lumos-superset/commit/86be1afa838e39b255f31d6475107af0f63af9a7) Metric and column position swap
  - [507fc6](https://git.garena.com/shopee-data/lumos-superset/commit/507fc6e8c16bb68b931d6ab2726b1a35a623ce8b) Implemented horizontal column ordering for pivot-table slices
  - [47833a](https://git.garena.com/shopee-data/lumos-superset/commit/47833a8290aa11b12ad64968461735161a5bc287) Fix the bug of applying previous feature after choosing metric under column.
- Build and delopyment
  - [dded71](https://git.garena.com/shopee-data/lumos-superset/commit/dded710a71a7bf1e7ac6563a4bbaed11cac722dc) Enable four different environment for docker-entrypoint.sh
  - [1e4e3e](https://git.garena.com/shopee-data/lumos-superset/commit/1e4e3e76ed438748ec26063d9ac33dc358b8e3f4) Enable docker for development and
  - [21e8c7](https://git.garena.com/shopee-data/lumos-superset/commit/21e8c74a4a25d8d93784f43fb5e7c7f87d3dee73) Replace npm with yarn for frontend build deployment
  - [057481](https://git.garena.com/shopee-data/lumos-superset/commit/057481441cddac86682285193ae927e38aafefff) Refactoring docker image build
  - [0bf678](https://git.garena.com/shopee-data/lumos-superset/commit/0bf678edde053fcd5ae0a4dd7b0ca4112f935f1b) Downgrade flask-appbuilder from 1.9.0 to 1.8.1.
  - [3319e7](https://git.garena.com/shopee-data/lumos-superset/commit/3319e7f0d95a44012c13182d54cdaba53521a538) Use environment variables to specify redis db connection.
  - [ddc447](https://git.garena.com/shopee-data/lumos-superset/commit/ddc4473683f5f7e359d3ea9a9a6c54f40f9c66df) Use environment variables to specify postgres db connection.
  - [2f2580](https://git.garena.com/shopee-data/lumos-superset/commit/2f2580c695c332b7c41ca6aad2f2ec5cc5146b46) Support `pip install` for runtime dependencies
- Runtime parameters adjustment
  - [c7acf9](https://git.garena.com/shopee-data/lumos-superset/commit/c7acf9bdd8f6f5620e214798b12dcdaa98505056) Adjust the default number of workers for gunicorn.
  - [9b60a2](https://git.garena.com/shopee-data/lumos-superset/commit/9b60a2def55c56ac644dd4eac9557c4d8e944276) Adjust default worker timeout from 5 minutes to 15 minutes
  - [e36d95](https://git.garena.com/shopee-data/lumos-superset/commit/e36d95cc67348d5409c6307bfa628e82e1ec6d86) Chagne default ROW_LIMIT from 50000 to 1000000
- Column configuration
  - [58bf5e](https://git.garena.com/shopee-data/lumos-superset/commit/58bf5ee456c69c7bb856dd154bba25031f97ae75) Fix the bug in configuration layout.
  - [8600d8](https://git.garena.com/shopee-data/lumos-superset/commit/8600d882e78d7bab7a9360b32dfb97cd0b7e5d35) Implement the feature of choosing text align.
  - [7c2e88](https://git.garena.com/shopee-data/lumos-superset/commit/7c2e886ef5426edde857a9dd76459917c2b08a52) Initial implementation for column configuration
- Row configuration
  - [ee3c1f](https://git.garena.com/shopee-data/lumos-superset/commit/ee3c1f8c56612da1c8b27f22f3a86313e4738211) Fix the bug of colouring properly in row config.
  - [1c63fe](https://git.garena.com/shopee-data/lumos-superset/commit/1c63fe97366875b2e7f41cd168319e7f951988c1) Initial implementation for row configuration
  - [e232f2](https://git.garena.com/shopee-data/lumos-superset/commit/e232f2286be1a97832e1e63c92d634f47f3ea860) Fix the bug of showing color in the row config.
  - [5cb109](https://git.garena.com/shopee-data/lumos-superset/commit/5cb1096671f28fdbd2d061e51fa08c32ce2fb90e) Fix the bug of deleting row 'all' and column 'all' in pivot table.
- webshot
  - [6b5bb1](https://git.garena.com/shopee-data/lumos-superset/commit/6b5bb1433f6266b9bd9c3df2023c615cea339b58) Add webshot for taking screenshot and send emails
- Bar chart
  - [73621d](https://git.garena.com/shopee-data/lumos-superset/commit/73621d365a5d5c59e928003b96543d0a51ac2546) Fix the bug in bar chart configuration.
  - [bfcd8c](https://git.garena.com/shopee-data/lumos-superset/commit/bfcd8c0a5d965d76d6dfbd9cee75098ce73ce4dd) Implement showing the bar value on the bar.
- CSV Upload
  - [e639e1](https://git.garena.com/shopee-data/lumos-superset/commit/e639e16b53808cad6b5e26dea01d4add9c8071fc) Change `upload data` to `add records` in project.
  - [f782dd](https://git.garena.com/shopee-data/lumos-superset/commit/f782dd0f53d796b3588ed7c84d3eafc723fcbdf7) Fix a bug when upload csv to database
  - [5dab7d](https://git.garena.com/shopee-data/lumos-superset/commit/5dab7dd107538497736bb28a70b15db4390d8d35) Add data upload mechanism
- Progress bar for table
  - [d14af2](https://git.garena.com/shopee-data/lumos-superset/commit/d14af2c5117c2bb3ebae7462f38c319a7e1f6d9a) Fix the bug of applying process bar with new feature.
  - [16a31e](https://git.garena.com/shopee-data/lumos-superset/commit/16a31e78f21b56a542ccc1a8037c75b5d0ce70c6) Fix the bug of canceling styling in progress bar.
  - [d46924](https://git.garena.com/shopee-data/lumos-superset/commit/d46924c02fd0326db1c21a64135f0871fb489b18) Show progress bar for table cell
  - [ba3af5](https://git.garena.com/shopee-data/lumos-superset/commit/ba3af5a37cc2f0256ffd2a2d9aec2c6e336267db) Fix the bug of wrong percentage showed in theprogress bar.
- Google OAuth login
  - [309a73](https://git.garena.com/shopee-data/lumos-superset/commit/309a73a4ccc13de004309aa7357356b1bea3b9a5) Enable google OAuth login
  - [b3fd35](https://git.garena.com/shopee-data/lumos-superset/commit/b3fd352210fc6c5b29bc3a13bd3c3005bb4cbc93) Enable login for emails with shopee.com
  - [37541e](https://git.garena.com/shopee-data/lumos-superset/commit/37541e1572834929971f1f137ec3e2627bef6562) Add "seagroup.com" domain for Google OAuth.
- Simple line chat visualization
  - [ae4954](https://git.garena.com/shopee-data/lumos-superset/commit/ae495413b2d7990e9ec9fd803fee202f7c656715) Add simple line chart
- Miscs
  - [8aee6c](https://git.garena.com/shopee-data/lumos-superset/commit/8aee6c689565a7b25fd1d0bbf26a2db95d8041ed) Fix column/metric duplication upon refreshing tables in Lumos
  - [0c1e8e](https://git.garena.com/shopee-data/lumos-superset/commit/0c1e8e770af53f4cc8f7025af0c2f59c7a731419) Enable hex characters for encoding CJK characters


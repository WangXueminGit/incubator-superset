## Change Log by Shopee Lumos

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

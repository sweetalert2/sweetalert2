## [8.15.2](https://github.com/sweetalert2/sweetalert2/compare/v8.15.1...v8.15.2) (2019-08-05)


### Bug Fixes

* apply buttons classes even if both of them are hidden ([#1697](https://github.com/sweetalert2/sweetalert2/issues/1697)) ([a90f139](https://github.com/sweetalert2/sweetalert2/commit/a90f139))

## [8.15.1](https://github.com/sweetalert2/sweetalert2/compare/v8.15.0...v8.15.1) (2019-08-03)


### Bug Fixes

* **types:** add missing getPopup() definition ([f4374a7](https://github.com/sweetalert2/sweetalert2/commit/f4374a7))

# [8.15.0](https://github.com/sweetalert2/sweetalert2/compare/v8.14.1...v8.15.0) (2019-08-02)


### Features

* **sass:** add variables for .swal2-actions ([3fc4c0c](https://github.com/sweetalert2/sweetalert2/commit/3fc4c0c))

## [8.14.1](https://github.com/sweetalert2/sweetalert2/compare/v8.14.0...v8.14.1) (2019-08-02)


### Bug Fixes

* **types:** support sweetalert2 modules from dist and src folders ([#1693](https://github.com/sweetalert2/sweetalert2/issues/1693)) ([ca1cbe9](https://github.com/sweetalert2/sweetalert2/commit/ca1cbe9))

# [8.14.0](https://github.com/sweetalert2/sweetalert2/compare/v8.13.6...v8.14.0) (2019-07-18)


### Features

* add closeButtonHtml param ([#1668](https://github.com/sweetalert2/sweetalert2/issues/1668)) ([7f5d662](https://github.com/sweetalert2/sweetalert2/commit/7f5d662))

## [8.13.6](https://github.com/sweetalert2/sweetalert2/compare/v8.13.5...v8.13.6) (2019-07-15)


### Bug Fixes

* get rid of DISPOSE_SWAL_TIMEOUT ([#1655](https://github.com/sweetalert2/sweetalert2/issues/1655)) ([fec6c13](https://github.com/sweetalert2/sweetalert2/commit/fec6c13))

## [8.13.5](https://github.com/sweetalert2/sweetalert2/compare/v8.13.4...v8.13.5) (2019-07-14)


### Bug Fixes

* set .swal2-actions' width to auto, fix [#1662](https://github.com/sweetalert2/sweetalert2/issues/1662) ([5acef36](https://github.com/sweetalert2/sweetalert2/commit/5acef36))

## [8.13.4](https://github.com/sweetalert2/sweetalert2/compare/v8.13.3...v8.13.4) (2019-07-09)


### Bug Fixes

* perform removeBodyClasses() as the very last step ([#1651](https://github.com/sweetalert2/sweetalert2/issues/1651)) ([624ccc9](https://github.com/sweetalert2/sweetalert2/commit/624ccc9))

## [8.13.3](https://github.com/sweetalert2/sweetalert2/compare/v8.13.2...v8.13.3) (2019-07-08)


### Bug Fixes

* Move `globalState` variables delete statements in closing callback ([#1647](https://github.com/sweetalert2/sweetalert2/issues/1647)) ([e5ded53](https://github.com/sweetalert2/sweetalert2/commit/e5ded53))

## [8.13.2](https://github.com/sweetalert2/sweetalert2/compare/v8.13.1...v8.13.2) (2019-07-08)


### Bug Fixes

* change closing sequence to detect a closing swal ([#1645](https://github.com/sweetalert2/sweetalert2/issues/1645)) ([9a8e802](https://github.com/sweetalert2/sweetalert2/commit/9a8e802))

## [8.13.1](https://github.com/sweetalert2/sweetalert2/compare/v8.13.0...v8.13.1) (2019-07-04)


### Bug Fixes

* inputValue as a promise (reject case) ([544c0c1](https://github.com/sweetalert2/sweetalert2/commit/544c0c1))

# [8.13.0](https://github.com/sweetalert2/sweetalert2/compare/v8.12.2...v8.13.0) (2019-06-21)


### Features

* add $swal2-icon-font-family SCSS variable ([#1628](https://github.com/sweetalert2/sweetalert2/issues/1628)) ([3f7aaa8](https://github.com/sweetalert2/sweetalert2/commit/3f7aaa8))

## [8.12.2](https://github.com/sweetalert2/sweetalert2/compare/v8.12.1...v8.12.2) (2019-06-20)


### Bug Fixes

* remove styles for #swal2-content ([#1624](https://github.com/sweetalert2/sweetalert2/issues/1624)) ([7b01573](https://github.com/sweetalert2/sweetalert2/commit/7b01573)), closes [#swal2](https://github.com/sweetalert2/sweetalert2/issues/swal2)

## [8.12.1](https://github.com/sweetalert2/sweetalert2/compare/v8.12.0...v8.12.1) (2019-06-10)


### Bug Fixes

* add z-index to the close button to prevent its overlapping by the content ([#1618](https://github.com/sweetalert2/sweetalert2/issues/1618)) ([ad07176](https://github.com/sweetalert2/sweetalert2/commit/ad07176))

# [8.12.0](https://github.com/sweetalert2/sweetalert2/compare/v8.11.7...v8.12.0) (2019-06-08)


### Features

* **dist:** use this instead of window to support Firefox extensions ([#1615](https://github.com/sweetalert2/sweetalert2/issues/1615)) ([9996bcf](https://github.com/sweetalert2/sweetalert2/commit/9996bcf))

## [8.11.7](https://github.com/sweetalert2/sweetalert2/compare/v8.11.6...v8.11.7) (2019-05-31)


### Bug Fixes

* **iOS:** do not prevent touchmove for inputs ([#1605](https://github.com/sweetalert2/sweetalert2/issues/1605)) ([69d57e3](https://github.com/sweetalert2/sweetalert2/commit/69d57e3))

## [8.11.6](https://github.com/sweetalert2/sweetalert2/compare/v8.11.5...v8.11.6) (2019-05-25)


### Bug Fixes

* run swalCloseEventFinished only for animations on popup ([#1601](https://github.com/sweetalert2/sweetalert2/issues/1601)) ([78920dc](https://github.com/sweetalert2/sweetalert2/commit/78920dc))

## [8.11.5](https://github.com/sweetalert2/sweetalert2/compare/v8.11.4...v8.11.5) (2019-05-23)


### Bug Fixes

* revert 'module' field, add 'browser' field to package.json ([#1599](https://github.com/sweetalert2/sweetalert2/issues/1599)) ([4fe56fb](https://github.com/sweetalert2/sweetalert2/commit/4fe56fb))

## [8.11.4](https://github.com/sweetalert2/sweetalert2/compare/v8.11.3...v8.11.4) (2019-05-22)


### Bug Fixes

* ie11 toast styles ([#1598](https://github.com/sweetalert2/sweetalert2/issues/1598)) ([bb415c1](https://github.com/sweetalert2/sweetalert2/commit/bb415c1))

## [8.11.3](https://github.com/sweetalert2/sweetalert2/compare/v8.11.2...v8.11.3) (2019-05-22)


### Bug Fixes

* **iOS:** disable body scroll when modal is shown ([#1596](https://github.com/sweetalert2/sweetalert2/issues/1596)) ([409be8f](https://github.com/sweetalert2/sweetalert2/commit/409be8f))

## [8.11.2](https://github.com/sweetalert2/sweetalert2/compare/v8.11.1...v8.11.2) (2019-05-22)


### Bug Fixes

* aviod double-executing of swalCloseEventFinished ([3874ba9](https://github.com/sweetalert2/sweetalert2/commit/3874ba9))

## [8.11.1](https://github.com/sweetalert2/sweetalert2/compare/v8.11.0...v8.11.1) (2019-05-16)


### Bug Fixes

* **sass:** Add !default to swal2-actions-justify-content ([#1593](https://github.com/sweetalert2/sweetalert2/issues/1593)) ([5062187](https://github.com/sweetalert2/sweetalert2/commit/5062187))

# [8.11.0](https://github.com/sweetalert2/sweetalert2/compare/v8.10.7...v8.11.0) (2019-05-16)


### Bug Fixes

* do not access innerParams in close() if there's no popup ([86e16f9](https://github.com/sweetalert2/sweetalert2/commit/86e16f9))


### Features

* **sass:** add $swal2-actions-justify-content variable to control buttons justification ([#1592](https://github.com/sweetalert2/sweetalert2/issues/1592)) ([c0fcab8](https://github.com/sweetalert2/sweetalert2/commit/c0fcab8))

## [8.10.7](https://github.com/sweetalert2/sweetalert2/compare/v8.10.6...v8.10.7) (2019-05-11)


### Bug Fixes

* pass isToast to removePopupAndResetState() ([#1585](https://github.com/sweetalert2/sweetalert2/issues/1585)) ([53f1047](https://github.com/sweetalert2/sweetalert2/commit/53f1047))

## [8.10.6](https://github.com/sweetalert2/sweetalert2/compare/v8.10.5...v8.10.6) (2019-05-10)


### Bug Fixes

* **sass:** add $swal2-close-button-hover-background ([c209d1b](https://github.com/sweetalert2/sweetalert2/commit/c209d1b))
* **styling:** revert opacity on toast hide animation ([1bb5a56](https://github.com/sweetalert2/sweetalert2/commit/1bb5a56))

## [8.10.5](https://github.com/sweetalert2/sweetalert2/compare/v8.10.4...v8.10.5) (2019-05-10)


### Bug Fixes

* remove opacity from toast show/hide animations ([#1584](https://github.com/sweetalert2/sweetalert2/issues/1584)) ([469bcc5](https://github.com/sweetalert2/sweetalert2/commit/469bcc5))

## [8.10.4](https://github.com/sweetalert2/sweetalert2/compare/v8.10.3...v8.10.4) (2019-05-09)


### Bug Fixes

* call Swal.fire() inside onClose() ([#1582](https://github.com/sweetalert2/sweetalert2/issues/1582)) ([9a02500](https://github.com/sweetalert2/sweetalert2/commit/9a02500))

## [8.10.3](https://github.com/sweetalert2/sweetalert2/compare/v8.10.2...v8.10.3) (2019-05-09)


### Bug Fixes

* improve the awareness of users to support awesomeness ([982a612](https://github.com/sweetalert2/sweetalert2/commit/982a612))

## [8.10.2](https://github.com/sweetalert2/sweetalert2/compare/v8.10.1...v8.10.2) (2019-05-07)


### Bug Fixes

* double-click on backdrop should close popup once ([#1579](https://github.com/sweetalert2/sweetalert2/issues/1579)) ([78d2d2a](https://github.com/sweetalert2/sweetalert2/commit/78d2d2a))
* unset props after closing a popup so GC will dispose them ([#1570](https://github.com/sweetalert2/sweetalert2/issues/1570)) ([81c0a0d](https://github.com/sweetalert2/sweetalert2/commit/81c0a0d))

## [8.10.1](https://github.com/sweetalert2/sweetalert2/compare/v8.10.0...v8.10.1) (2019-05-06)


### Bug Fixes

* improve checking when popup is animated ([#1576](https://github.com/sweetalert2/sweetalert2/issues/1576)) ([9b82c5a](https://github.com/sweetalert2/sweetalert2/commit/9b82c5a))

# [8.10.0](https://github.com/sweetalert2/sweetalert2/compare/v8.9.0...v8.10.0) (2019-05-03)


### Features

* **sass:** add variables for toast, input and backdrop ([#1571](https://github.com/sweetalert2/sweetalert2/issues/1571)) ([feab788](https://github.com/sweetalert2/sweetalert2/commit/feab788))

# [8.9.0](https://github.com/sweetalert2/sweetalert2/compare/v8.8.7...v8.9.0) (2019-04-28)


### Features

* **sass:** add $swal2-input-color ([#1563](https://github.com/sweetalert2/sweetalert2/issues/1563)) ([cbe02de](https://github.com/sweetalert2/sweetalert2/commit/cbe02de))

## [8.8.7](https://github.com/sweetalert2/sweetalert2/compare/v8.8.6...v8.8.7) (2019-04-21)


### Bug Fixes

* revert "chore(tools): git hooks for running linters before commit ([#1537](https://github.com/sweetalert2/sweetalert2/issues/1537))" ([#1559](https://github.com/sweetalert2/sweetalert2/issues/1559)) ([d22b234](https://github.com/sweetalert2/sweetalert2/commit/d22b234))

## [8.8.6](https://github.com/sweetalert2/sweetalert2/compare/v8.8.5...v8.8.6) (2019-04-21)


### Bug Fixes

* force extensions for import statements ([fa94cec](https://github.com/sweetalert2/sweetalert2/commit/fa94cec))

## [8.8.5](https://github.com/sweetalert2/sweetalert2/compare/v8.8.4...v8.8.5) (2019-04-13)


### Bug Fixes

* do not repove style attribute from inputs ([#1545](https://github.com/sweetalert2/sweetalert2/issues/1545)) ([cf44531](https://github.com/sweetalert2/sweetalert2/commit/cf44531))

## [8.8.4](https://github.com/sweetalert2/sweetalert2/compare/v8.8.3...v8.8.4) (2019-04-13)


### Bug Fixes

* do not rerender input on update ([#1543](https://github.com/sweetalert2/sweetalert2/issues/1543)) ([2649c34](https://github.com/sweetalert2/sweetalert2/commit/2649c34))

## [8.8.3](https://github.com/sweetalert2/sweetalert2/compare/v8.8.2...v8.8.3) (2019-04-10)


### Bug Fixes

* **d.ts:** add missing HTMLElement to target param ([2ea9d80](https://github.com/sweetalert2/sweetalert2/commit/2ea9d80))

## [8.8.2](https://github.com/sweetalert2/sweetalert2/compare/v8.8.1...v8.8.2) (2019-04-10)


### Bug Fixes

* remove unnecessary nesting in styles ([#1526](https://github.com/sweetalert2/sweetalert2/issues/1526)) ([848cf9f](https://github.com/sweetalert2/sweetalert2/commit/848cf9f))

## [8.8.1](https://github.com/sweetalert2/sweetalert2/compare/v8.8.0...v8.8.1) (2019-04-02)


### Bug Fixes

* do not re-render icon if  isn't provided or the same as before ([#1518](https://github.com/sweetalert2/sweetalert2/issues/1518)) ([f7613af](https://github.com/sweetalert2/sweetalert2/commit/f7613af))

# [8.8.0](https://github.com/sweetalert2/sweetalert2/compare/v8.7.1...v8.8.0) (2019-03-31)


### Features

* allow image size to be set in any CSS units ([#1510](https://github.com/sweetalert2/sweetalert2/issues/1510)) ([9d74299](https://github.com/sweetalert2/sweetalert2/commit/9d74299))

## [8.7.1](https://github.com/sweetalert2/sweetalert2/compare/v8.7.0...v8.7.1) (2019-03-30)


### Bug Fixes

* update internal params in Swal.update() ([#1505](https://github.com/sweetalert2/sweetalert2/issues/1505)) ([e81d840](https://github.com/sweetalert2/sweetalert2/commit/e81d840))

# [8.7.0](https://github.com/sweetalert2/sweetalert2/compare/v8.6.0...v8.7.0) (2019-03-26)


### Features

* make customClass updatable ([#1467](https://github.com/sweetalert2/sweetalert2/issues/1467)) ([c144810](https://github.com/sweetalert2/sweetalert2/commit/c144810))

# [8.6.0](https://github.com/sweetalert2/sweetalert2/compare/v8.5.0...v8.6.0) (2019-03-24)


### Features

* **sass-variables:** add $swal2-container-padding ([#1463](https://github.com/sweetalert2/sweetalert2/issues/1463)) ([d448794](https://github.com/sweetalert2/sweetalert2/commit/d448794))

# [8.5.0](https://github.com/sweetalert2/sweetalert2/compare/v8.4.0...v8.5.0) (2019-03-15)


### Features

* **styles:** add .swal2-arabic-question-mark ([#1448](https://github.com/sweetalert2/sweetalert2/issues/1448)) ([e57ce7f](https://github.com/sweetalert2/sweetalert2/commit/e57ce7f))

# [8.4.0](https://github.com/sweetalert2/sweetalert2/compare/v8.3.0...v8.4.0) (2019-03-15)


### Features

* add customClass.icon, simplify icons markup ([ba4a485](https://github.com/sweetalert2/sweetalert2/commit/ba4a485))
* add Swal.getIcon() ([acc42a0](https://github.com/sweetalert2/sweetalert2/commit/acc42a0))

# [8.3.0](https://github.com/sweetalert2/sweetalert2/compare/v8.2.6...v8.3.0) (2019-03-11)


### Bug Fixes

* remove excessive isVisible check for buttons, support Jest testing enviroment ([#1439](https://github.com/sweetalert2/sweetalert2/issues/1439)) ([42ef213](https://github.com/sweetalert2/sweetalert2/commit/42ef213))


### Features

* **api:** allow adding custom classes to header, content, footer, etc. ([#1441](https://github.com/sweetalert2/sweetalert2/issues/1441)) ([4381bae](https://github.com/sweetalert2/sweetalert2/commit/4381bae))

## [8.2.6](https://github.com/sweetalert2/sweetalert2/compare/v8.2.5...v8.2.6) (2019-02-26)


### Bug Fixes

* inactive step background ([#1428](https://github.com/sweetalert2/sweetalert2/issues/1428)) ([2f7701c](https://github.com/sweetalert2/sweetalert2/commit/2f7701c))

## [8.2.5](https://github.com/sweetalert2/sweetalert2/compare/v8.2.4...v8.2.5) (2019-02-26)


### Bug Fixes

* make close button friendly for non-UTF encodings × -> &times; ([#1431](https://github.com/sweetalert2/sweetalert2/issues/1431)) ([b2006c3](https://github.com/sweetalert2/sweetalert2/commit/b2006c3))

## [8.2.4](https://github.com/sweetalert2/sweetalert2/compare/v8.2.3...v8.2.4) (2019-02-23)


### Bug Fixes

* padding 0 ([#1424](https://github.com/sweetalert2/sweetalert2/issues/1424)) ([f1a2259](https://github.com/sweetalert2/sweetalert2/commit/f1a2259))

## [8.2.3](https://github.com/sweetalert2/sweetalert2/compare/v8.2.2...v8.2.3) (2019-02-21)


### Bug Fixes

* Swal.isVisible() ([#1423](https://github.com/sweetalert2/sweetalert2/issues/1423)) ([97b6bd4](https://github.com/sweetalert2/sweetalert2/commit/97b6bd4))

## [8.2.2](https://github.com/sweetalert2/sweetalert2/compare/v8.2.1...v8.2.2) (2019-02-20)


### Bug Fixes

* crash if swal2 action buttons classes are applied to elements in html prop ([#1420](https://github.com/sweetalert2/sweetalert2/issues/1420)) ([a21ef6b](https://github.com/sweetalert2/sweetalert2/commit/a21ef6b))

## [8.2.1](https://github.com/sweetalert2/sweetalert2/compare/v8.2.0...v8.2.1) (2019-02-18)


### Bug Fixes

* model cut of by bottom positioning ([#1417](https://github.com/sweetalert2/sweetalert2/issues/1417)) ([8b0e5dd](https://github.com/sweetalert2/sweetalert2/commit/8b0e5dd))

# [8.2.0](https://github.com/sweetalert2/sweetalert2/compare/v8.1.0...v8.2.0) (2019-02-17)


### Features

* **api:** add `scrollbarPadding` param ([#1414](https://github.com/sweetalert2/sweetalert2/issues/1414)) ([d095937](https://github.com/sweetalert2/sweetalert2/commit/d095937))

# [8.1.0](https://github.com/sweetalert2/sweetalert2/compare/v8.0.7...v8.1.0) (2019-02-17)


### Features

* add new SCSS variables for input and progress steps ([#1411](https://github.com/sweetalert2/sweetalert2/issues/1411)) ([5be77b6](https://github.com/sweetalert2/sweetalert2/commit/5be77b6))

## [8.0.7](https://github.com/sweetalert2/sweetalert2/compare/v8.0.6...v8.0.7) (2019-02-12)


### Bug Fixes

* restore correct padding when scrollbar is present ([#1410](https://github.com/sweetalert2/sweetalert2/issues/1410)) ([f73f1d7](https://github.com/sweetalert2/sweetalert2/commit/f73f1d7))

## [8.0.6](https://github.com/sweetalert2/sweetalert2/compare/v8.0.5...v8.0.6) (2019-02-05)


### Bug Fixes

* **api:** falsy values in preConfirm ([#1403](https://github.com/sweetalert2/sweetalert2/issues/1403)) ([f6e1a30](https://github.com/sweetalert2/sweetalert2/commit/f6e1a30))

## [8.0.5](https://github.com/sweetalert2/sweetalert2/compare/v8.0.4...v8.0.5) (2019-02-02)


### Bug Fixes

* **build-dist:** git add src/SweetAlert.js, connected to [#1401](https://github.com/sweetalert2/sweetalert2/issues/1401) ([d024119](https://github.com/sweetalert2/sweetalert2/commit/d024119))

## [8.0.4](https://github.com/sweetalert2/sweetalert2/compare/v8.0.3...v8.0.4) (2019-02-02)


### Bug Fixes

* add Swal.version to src/SweetAlert.js ([#1401](https://github.com/sweetalert2/sweetalert2/issues/1401)) ([d4c19a3](https://github.com/sweetalert2/sweetalert2/commit/d4c19a3))

## [8.0.3](https://github.com/sweetalert2/sweetalert2/compare/v8.0.2...v8.0.3) (2019-01-29)


### Bug Fixes

* **api:** showLoading() should open a new popup ([#1394](https://github.com/sweetalert2/sweetalert2/issues/1394)) ([38823ff](https://github.com/sweetalert2/sweetalert2/commit/38823ff))

## [8.0.2](https://github.com/sweetalert2/sweetalert2/compare/v8.0.1...v8.0.2) (2019-01-28)


### Bug Fixes

* **package.json:** remove the 'module' field ([#1392](https://github.com/sweetalert2/sweetalert2/issues/1392)) ([b87b42f](https://github.com/sweetalert2/sweetalert2/commit/b87b42f))

## [8.0.1](https://github.com/sweetalert2/sweetalert2/compare/v8.0.0...v8.0.1) (2019-01-19)


### Bug Fixes

* use .js in imports to support ES modules ([0e3e89e](https://github.com/sweetalert2/sweetalert2/commit/0e3e89e))

# [8.0.0](https://github.com/sweetalert2/sweetalert2/compare/v7.33.1...v8.0.0) (2019-01-19)

Detailed summury on the [release page](https://github.com/sweetalert2/sweetalert2/releases/tag/v8.0.0).

* BREAKING CHANGE: Change the main call method: swal() -> Swal.fire() (#1438)
* BREAKING CHANGE: remove getButtonsWrapper() ([c93b5e3](https://github.com/sweetalert2/sweetalert2/commit/c93b5e3))
* BREAKING CHANGE: close() as instance method (#1379) ([2519c17](https://github.com/sweetalert2/sweetalert2/commit/2519c17)), closes [#1379](https://github.com/sweetalert2/sweetalert2/issues/1379)
* BREAKING CHANGE: replace deprecated `jsnext:main` with `module` in package.json (#1378) ([1785905](https://github.com/sweetalert2/sweetalert2/commit/1785905)), closes [#1378](https://github.com/sweetalert2/sweetalert2/issues/1378)
* BREAKING CHANGE: drop Bower support (#1377) ([cb4ef28](https://github.com/sweetalert2/sweetalert2/commit/cb4ef28)), closes [#1377](https://github.com/sweetalert2/sweetalert2/issues/1377)
* BREAKING CHANGE: remove withNoNewKeyword enhancer (#1372) ([f581352](https://github.com/sweetalert2/sweetalert2/commit/f581352)), closes [#1372](https://github.com/sweetalert2/sweetalert2/issues/1372)
* BREAKING CHANGE: remove swal.noop() ([40d6fbb](https://github.com/sweetalert2/sweetalert2/commit/40d6fbb))
* BREAKING CHANGE: rename $swal2-validationerror -> $swal2-validation-message (#1370) ([9d1b13b](https://github.com/sweetalert2/sweetalert2/commit/9d1b13b)), closes [#1370](https://github.com/sweetalert2/sweetalert2/issues/1370)
* BREAKING CHANGE: inputValidator and preConfirm should always resolve (#1383) ([fc70cf9](https://github.com/sweetalert2/sweetalert2/commit/fc70cf9)), closes [#1383](https://github.com/sweetalert2/sweetalert2/issues/1383)
* BREAKING CHANGE: remove setDefault and resetDefaults (#1365) ([97c1d7c](https://github.com/sweetalert2/sweetalert2/commit/97c1d7c)), closes [#1365](https://github.com/sweetalert2/sweetalert2/issues/1365)
* BREAKING CHANGE: remove extraParams (#1363) ([5125491](https://github.com/sweetalert2/sweetalert2/commit/5125491)), closes [#1363](https://github.com/sweetalert2/sweetalert2/issues/1363)
* BREAKING CHANGE: remove showValidationError and resetValidationError (#1367) ([50a1eff](https://github.com/sweetalert2/sweetalert2/commit/50a1eff)), closes [#1367](https://github.com/sweetalert2/sweetalert2/issues/1367)
* BREAKING CHANGE: remove useRejections and expectRejections (#1362) ([f050caf](https://github.com/sweetalert2/sweetalert2/commit/f050caf)), closes [#1362](https://github.com/sweetalert2/sweetalert2/issues/1362)
* BREAKING CHANGE: dismissReason: overlay -> backdrop (#1360) ([d05bf33](https://github.com/sweetalert2/sweetalert2/commit/d05bf33)), closes [#1360](https://github.com/sweetalert2/sweetalert2/issues/1360)
* BREAKING CHANGE: drop Android 4.4 support (#1359) ([c0eddf3](https://github.com/sweetalert2/sweetalert2/commit/c0eddf3)), closes [#1359](https://github.com/sweetalert2/sweetalert2/issues/1359)


### Features

* **api:** add update() method ([#1186](https://github.com/sweetalert2/sweetalert2/issues/1186)) ([348e8b7](https://github.com/sweetalert2/sweetalert2/commit/348e8b7))


### BREAKING CHANGES

* swal() -> Swal.fire() (#1438)
* close() as instance method (#1379)
* drop Android 4.4 support (#1359)
* replace deprecated `jsnext:main` with `module` in package.json (#1378)
* drop Bower support (#1377)
* remove withNoNewKeyword enhancer (#1372)
* remove swal.noop()
* rename $swal2-validationerror -> $swal2-validation-message (#1370)
* inputValidator and preConfirm should always resolve (#1383)
* remove setDefault and resetDefaults (#1365)
* remove extraParams (#1363)
* remove showValidationError and resetValidationError (#1367)
* remove useRejections and expectRejections (#1362)
* dismissReason: overlay -> backdrop (#1360)
* remove getButtonsWrapper()

## [7.33.1](https://github.com/sweetalert2/sweetalert2/compare/v7.33.0...v7.33.1) (2018-12-22)


### Bug Fixes

* **d.ts:** add customContainerClass definition ([#1351](https://github.com/sweetalert2/sweetalert2/issues/1351)) ([c5f11e7](https://github.com/sweetalert2/sweetalert2/commit/c5f11e7))

# [7.33.0](https://github.com/sweetalert2/sweetalert2/compare/v7.32.4...v7.33.0) (2018-12-22)


### Features

* **API:** add customContainerClass for specifying custom container class ([#1347](https://github.com/sweetalert2/sweetalert2/issues/1347)) ([c5ef1aa](https://github.com/sweetalert2/sweetalert2/commit/c5ef1aa))

## [7.32.4](https://github.com/sweetalert2/sweetalert2/compare/v7.32.3...v7.32.4) (2018-12-15)


### Bug Fixes

* remove excessive args check ([#1344](https://github.com/sweetalert2/sweetalert2/issues/1344)) ([d302584](https://github.com/sweetalert2/sweetalert2/commit/d302584))
* trigger release ([f70362c](https://github.com/sweetalert2/sweetalert2/commit/f70362c))

## [7.32.3](https://github.com/sweetalert2/sweetalert2/compare/v7.32.2...v7.32.3) (2018-12-15)


### Bug Fixes

* Remove excessive args check ([#1344](https://github.com/sweetalert2/sweetalert2/issues/1344))

## [7.32.2](https://github.com/sweetalert2/sweetalert2/compare/v7.32.1...v7.32.2) (2018-12-09)


### Bug Fixes

* do not throw warnings when inputValue is a promise ([#1333](https://github.com/sweetalert2/sweetalert2/issues/1333)) ([3607b72](https://github.com/sweetalert2/sweetalert2/commit/3607b72))

## [7.32.1](https://github.com/sweetalert2/sweetalert2/compare/v7.32.0...v7.32.1) (2018-12-09)


### Bug Fixes

* **ie11:** do not fail on <svg>.contains() ([#1331](https://github.com/sweetalert2/sweetalert2/issues/1331)) ([f7cb2c2](https://github.com/sweetalert2/sweetalert2/commit/f7cb2c2))

# [7.32.0](https://github.com/sweetalert2/sweetalert2/compare/v7.31.1...v7.32.0) (2018-12-08)


### Features

* **api:** add .isTimerRunning() ([#1330](https://github.com/sweetalert2/sweetalert2/issues/1330)) ([0624e7a](https://github.com/sweetalert2/sweetalert2/commit/0624e7a))

## [7.31.1](https://github.com/sweetalert2/sweetalert2/compare/v7.31.0...v7.31.1) (2018-12-07)


### Bug Fixes

* check this.running in timer methods ([#1327](https://github.com/sweetalert2/sweetalert2/issues/1327)) ([418b8d3](https://github.com/sweetalert2/sweetalert2/commit/418b8d3))
* support HTMLElement for setting title/html/footer ([#1328](https://github.com/sweetalert2/sweetalert2/issues/1328)) ([6f35e48](https://github.com/sweetalert2/sweetalert2/commit/6f35e48))

# [7.31.0](https://github.com/sweetalert2/sweetalert2/compare/v7.30.0...v7.31.0) (2018-12-06)


### Features

* **api:** add .resumeTimer(), .toggleTimer(), .increaseTimer() ([#1325](https://github.com/sweetalert2/sweetalert2/issues/1325)) ([77649ee](https://github.com/sweetalert2/sweetalert2/commit/77649ee))

# [7.30.0](https://github.com/sweetalert2/sweetalert2/compare/v7.29.2...v7.30.0) (2018-12-05)


### Features

* **api:** add .stopTimer() ([#1322](https://github.com/sweetalert2/sweetalert2/issues/1322)) ([654caf2](https://github.com/sweetalert2/sweetalert2/commit/654caf2))

## [7.29.2](https://github.com/sweetalert2/sweetalert2/compare/v7.29.1...v7.29.2) (2018-11-26)


### Bug Fixes

* **validators:** support long top level domain names in URL validator ([#1307](https://github.com/sweetalert2/sweetalert2/issues/1307)) ([3263217](https://github.com/sweetalert2/sweetalert2/commit/3263217))

## [7.29.1](https://github.com/sweetalert2/sweetalert2/compare/v7.29.0...v7.29.1) (2018-11-18)


### Bug Fixes

* avoid Edge from crashing ([#1299](https://github.com/sweetalert2/sweetalert2/issues/1299)) ([69965e0](https://github.com/sweetalert2/sweetalert2/commit/69965e0))

# [7.29.0](https://github.com/sweetalert2/sweetalert2/compare/v7.28.13...v7.29.0) (2018-11-08)


### Features

* **input:** add .checkValidity() support ([#1284](https://github.com/sweetalert2/sweetalert2/issues/1284)) ([361d2bd](https://github.com/sweetalert2/sweetalert2/commit/361d2bd))

## [7.28.13](https://github.com/sweetalert2/sweetalert2/compare/v7.28.12...v7.28.13) (2018-11-08)


### Bug Fixes

* allow inputAttributes.placeholder ([#1279](https://github.com/sweetalert2/sweetalert2/issues/1279)) ([7ec7291](https://github.com/sweetalert2/sweetalert2/commit/7ec7291))

## [7.28.12](https://github.com/sweetalert2/sweetalert2/compare/v7.28.11...v7.28.12) (2018-11-06)


### Bug Fixes

* **direction:** Support for CSS direction property ([#1275](https://github.com/sweetalert2/sweetalert2/issues/1275)) ([a12fefb](https://github.com/sweetalert2/sweetalert2/commit/a12fefb)), closes [#1262](https://github.com/sweetalert2/sweetalert2/issues/1262)

## [7.28.11](https://github.com/sweetalert2/sweetalert2/compare/v7.28.10...v7.28.11) (2018-10-29)


### Bug Fixes

* **build:** use `.min.css` for `.all.js` to prevent the string concatenation ([#1268](https://github.com/sweetalert2/sweetalert2/issues/1268)) ([f18b4bc](https://github.com/sweetalert2/sweetalert2/commit/f18b4bc))

## [7.28.10](https://github.com/sweetalert2/sweetalert2/compare/v7.28.9...v7.28.10) (2018-10-25)


### Bug Fixes

* **sarafi:** add preventDefault() in esc key handling ([#1264](https://github.com/sweetalert2/sweetalert2/issues/1264)) ([8a5c40f](https://github.com/sweetalert2/sweetalert2/commit/8a5c40f))

## [7.28.9](https://github.com/sweetalert2/sweetalert2/compare/v7.28.8...v7.28.9) (2018-10-24)


### Bug Fixes

* **typings:** validationMesage typo ([3e9dbd5](https://github.com/sweetalert2/sweetalert2/commit/3e9dbd5))

## [7.28.8](https://github.com/sweetalert2/sweetalert2/compare/v7.28.7...v7.28.8) (2018-10-21)


### Bug Fixes

* add resize handlers for IE11 vertical alignment fix ([ba1d4cf](https://github.com/sweetalert2/sweetalert2/commit/ba1d4cf))

## [7.28.7](https://github.com/sweetalert2/sweetalert2/compare/v7.28.6...v7.28.7) (2018-10-18)


### Bug Fixes

* **animation:** detect animation before initialization ([#1255](https://github.com/sweetalert2/sweetalert2/issues/1255)) ([7e9cf38](https://github.com/sweetalert2/sweetalert2/commit/7e9cf38))

## [7.28.6](https://github.com/sweetalert2/sweetalert2/compare/v7.28.5...v7.28.6) (2018-10-18)


### Bug Fixes

* **styles:** body 'overflow-y: hidden' -> 'overflow: hidden' ([#1254](https://github.com/sweetalert2/sweetalert2/issues/1254)) ([1b3d505](https://github.com/sweetalert2/sweetalert2/commit/1b3d505))

## [7.28.5](https://github.com/sweetalert2/sweetalert2/compare/v7.28.4...v7.28.5) (2018-10-12)


### Bug Fixes

* scroll container to the top on open ([#1248](https://github.com/sweetalert2/sweetalert2/issues/1248)) ([369922f](https://github.com/sweetalert2/sweetalert2/commit/369922f))

## [7.28.4](https://github.com/sweetalert2/sweetalert2/compare/v7.28.3...v7.28.4) (2018-09-28)


### Bug Fixes

* **release:** fix version in dist files ([#1235](https://github.com/sweetalert2/sweetalert2/issues/1235)) ([14eea6f](https://github.com/sweetalert2/sweetalert2/commit/14eea6f))

## [7.28.3](https://github.com/sweetalert2/sweetalert2/compare/v7.28.2...v7.28.3) (2018-09-28)


### Bug Fixes

* **api:** call onAfterClose after previousActiveElement is focused ([#1233](https://github.com/sweetalert2/sweetalert2/issues/1233)) ([68c83ed](https://github.com/sweetalert2/sweetalert2/commit/68c83ed))

## [7.28.2](https://github.com/sweetalert2/sweetalert2/compare/v7.28.1...v7.28.2) (2018-09-24)


### Bug Fixes

* **styles:** revert breaking changes in SASS variables ([#1229](https://github.com/sweetalert2/sweetalert2/issues/1229)) ([7d9f9d1](https://github.com/sweetalert2/sweetalert2/commit/7d9f9d1))

## [7.28.1](https://github.com/sweetalert2/sweetalert2/compare/v7.28.0...v7.28.1) (2018-09-23)


### Bug Fixes

* **inputValue:** warn about invalid inputValue ([#1228](https://github.com/sweetalert2/sweetalert2/issues/1228)) ([8adebd0](https://github.com/sweetalert2/sweetalert2/commit/8adebd0))

# [7.28.0](https://github.com/sweetalert2/sweetalert2/compare/v7.27.0...v7.28.0) (2018-09-23)


### Features

* **getters:** expose .getValidationMessage() ([3780165](https://github.com/sweetalert2/sweetalert2/commit/3780165))
* **params:** add validationMessage ([73e0413](https://github.com/sweetalert2/sweetalert2/commit/73e0413))
* **params:** deprecate extraParams ([1224200](https://github.com/sweetalert2/sweetalert2/commit/1224200))

# [7.27.0](https://github.com/sweetalert2/sweetalert2/compare/v7.26.29...v7.27.0) (2018-09-22)


### Features

* **styles:** add [@media](https://github.com/media) print styles ([#1223](https://github.com/sweetalert2/sweetalert2/issues/1223)) ([1432e84](https://github.com/sweetalert2/sweetalert2/commit/1432e84))

## [7.26.29](https://github.com/sweetalert2/sweetalert2/compare/v7.26.28...v7.26.29) (2018-09-16)


### Bug Fixes

* **styles:** wrap buttons (fix [#1201](https://github.com/sweetalert2/sweetalert2/issues/1201)) ([f4364e7](https://github.com/sweetalert2/sweetalert2/commit/f4364e7))

## [7.26.28](https://github.com/sweetalert2/sweetalert2/compare/v7.26.27...v7.26.28) (2018-09-07)


### Bug Fixes

* **release:** purge jsdelivr before switching to master ([#1215](https://github.com/sweetalert2/sweetalert2/issues/1215)) ([4b5c55d](https://github.com/sweetalert2/sweetalert2/commit/4b5c55d))

## [7.26.27](https://github.com/sweetalert2/sweetalert2/compare/v7.26.26...v7.26.27) (2018-09-07)


### Bug Fixes

* **release:** purge jsdelivr cache after releasing a new version ([#1214](https://github.com/sweetalert2/sweetalert2/issues/1214)) ([6229c1f](https://github.com/sweetalert2/sweetalert2/commit/6229c1f))

## [7.26.26](https://github.com/sweetalert2/sweetalert2/compare/v7.26.25...v7.26.26) (2018-09-06)


### Bug Fixes

* **release:** remove --unshallow from fetch ([8f18115](https://github.com/sweetalert2/sweetalert2/commit/8f18115))

## [7.26.25](https://github.com/sweetalert2/sweetalert2/compare/v7.26.24...v7.26.25) (2018-09-06)


### Bug Fixes

* **release:** fix cherry-picking the latest commit to master ([d2da2e1](https://github.com/sweetalert2/sweetalert2/commit/d2da2e1))

## [7.26.24](https://github.com/sweetalert2/sweetalert2/compare/v7.26.23...v7.26.24) (2018-09-06)


### Bug Fixes

* clear changelog and trigger new release ([b652257](https://github.com/sweetalert2/sweetalert2/commit/b652257))

# prjona

*v1.2.0*

>This is a small React Native project by Peter Rosendahl creating a tool for knitting practices.

# TODO
- Continue implementing the Project handling
  1. state should just handle the current project, and localstorage should save current project on change.
  2. don't provide multiple projects until new major release is in development
- Clean repository
  - package.json
  - android/build.gradle
  - send gradle.properties data to a .md file in Drive
  - add in Readme.md how to setup project with new RN installations every time.
- Major release: Projects
  1. Top bar + drawer menu that provides a way to add and manage multiple projects,
  2. current display should only concern the current project.
  3. Projects should have name input in top of page.

# Version Log

### [0.0.1.03] - 10/04/2024
- Changed data handling to be Project class instead.
- Modified AsyncStorage to save entire project.
- Released v1.2 (102) to Google Play.
- Re-installed ReactNative project for latest versions.

### [0.0.1.02] - 10/10/2021
- Added Textarea input for notes.
- Added AsyncStorage for saving notes.
- Released v1.1.

### [0.0.1.01] - 24/09/2021
- Initialized React Native project with React Native CLI and Typescript
- Added all the main functionality to the Main page.
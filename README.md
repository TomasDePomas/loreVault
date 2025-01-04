# LoreVault
_A multiplatform editor, viewer and organizer for rich text and images using a portable, zip based file format containing a collection text and image files, readable outside of the LoreVault application._

## Contents
1. Installation
2. Development
3. Deploying
4. Todolist

## Installation
1. clone repo
2. run yarn to install dependencies 
```sh
yarn
``` 

## Development
### Running the application
#### For Browser development:
1. run:
```sh 
yarn serve
```
#### For Desktop development:
1. run:
```sh 
yarn desktop:serve
```

#### For Android development,
1. Start android studio
2. Start an emulator
3. Run:
```sh 
yarn android:serve
```
### Linting:
To check, run :
```sh 
yarn lint
```
or apply auto fixes, run:
```sh 
yarn lint:fix
```
or to check typescript validity, run:
```sh 
yarn lint:ts
```

## Deploying
TBD

## Todolist
- ✓ Run frontend in browser
- ○ Run tauri to mobile
  - ✓ Android
  - ○ iOS
- ○ Run tauri on desktop
  - ✓ Linux
  - ✓ Windows
  - ○ MacOS
- ✓ Create .chest file format
  - ✓ add texts
    - ✓ names
    - ✓ tags in different levels
    - ✓ main content
    - ✓ rich text
    - ✓ images in text
  - ✓ add images
  - ○ add map images
  - ✓ test opening/closing chest on desktop
  - ○ test opening/closing chest on mobile
  - ✓ test opening/closing chest in browser
- ✓ create database based on .chest file for extra speed
  - ○ Terms database
- ✓ add text editor
- ✓ add image management
- ○ add map management
- ○ add overviews
  - ○ Category pages
- ✓ add view pages
- ✓ add search

### Bugs:
- ○ Spaces disappearing around markup
- ○ Unused images not removed from archive
- ○ Images in text not user-friendly
- ✓ unable to skip menu in wysiwyg while tabbing

# Kiosk Interface

The Kiosk Interface is used in the Science Museum Kiosk ecosystem to build packages 
for deployment to kiosks.

## Up and Running

To start working on the Kiosk Interface, complete the following steps:

* clone this repo
* run `yarn` in the root directory
* run `yarn start` to start developing

## Testing on a kiosk

To create a package that can be manually transferred to a kiosk, run `yarn build:package`.
This command will build the testing version of the package, and produce a `.package` file 
that can then be transferred to a kiosk using the kiosk debug menu (`command / control + d`)

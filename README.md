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

## Custom Pages

Custom pages, or articles, allow specialised components to be added to a kiosk package.

**Workflow**

* Create a component under the `src/components/pages` folder
* Make appropriate changes to `src/components/Article.jsx#makeMixedArticle` to add your component
* Add a sample manifest page to the demo manifest at `public/manifest.json`
* **Test that the component functions as expected by running** `yarn build:package`
* Create a custom page in the KMS (currently via tinker on the command line)

### 3D Model
See `ADDING_A_3D_MODEL.md`

## Updating Staging

* SSH into the staging environment
* Change kiosk_version to the bitbucket pipeline number inside `/var/www/kiosk_manager/.env` (requires `sudo`)
* run `sudo service php7.3-fpm restart`
* run `sudo supervisorctl restart all`
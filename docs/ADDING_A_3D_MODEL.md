# Adding A 3D Model

## Before you get started

You will need the following:

* 3D Assets (A single .obj file and an associated .mtl and texture file)
* Any image files needed for inclusion in the sub-pages
* A rough idea of whereabouts the camera should be for each hot spot

## Importing the model

The structure of the article in the manifest should be as follows (sections are explained in detail below)

```json
{
  "articleID": "5-3",
  "type": "model",
  "title": "Zombie Boy",
  "titleImage": {
    "assetType": "image",
    "assetSource": "./media/01.jpg"
  },
  "asset": {
    "assetDirectory": "./media/af0ra7hg0ae99r9eaggds43wg/",
    "obj": "ScanLAB_Projects_SM_ZombieBoy_170000_v02.OBJ",
    "mtl": "ScanLAB_Projects_SM_ZombieBoy_TEXTURE.mtl",
    "assetType": "model",
    "nameText": "Zombie Boy",
    "sourceText": "",
    "developer_comments": "Model is approx x: -10, 10 y: 36, -36 z: -5, 5",
    "position": [
      -48,
      0,
      -25
    ],
    "rotation": [
      270,
      0,
      0
    ],
    "scale": 20,
    "background": ["#8c8c76", "#000000"],
    "hotspot_inactive": "#DED4BC",
    "hotspot_active": "#80809c"
  },
  "subpages": [
    {
      "pageID": "5-3-1",
      "type": "title",
      "asset": {
        "assetType": "image",
        "assetSource": "./media/01.jpg"
      },
      "title": "Self-Conscious Gene by Marc Quinn",
      "content": [
        "Quinn’s sculpture portrays Rick Genest, an actor, artist and model from Canada, known for covering his entire body in anatomical tattoos.",
        "Explore the artwork in detail to find out more about Rick’s life, how the statue was made, and the history of tattooing."
      ],
      "camera": {
        "position": [
          121,
          8,
          -16
        ],
        "rotation": [
          0,
          20,
          200
        ]
      }
    },
    {
      "pageID": "5-3-2",
      "type": "hotspot",
      "title": "Working with Bronze",
      "content": [
        "Made of bronze, this statue was cast in sections and then welded together.",
        "These lines show the joining points and have been left to reveal the making process.",
        "The surface of bronze changes colour, which will change the appearance of these joins over time."
      ],
      "camera": {
        "position": [
          20.09903325018832,
          -17.387001030561617,
          25.222023100719312
        ],
        "rotation": [
          0,
          20,
          200
        ]
      },
      "hotspot": {
        "focus": [
          0,
          -20,
          0
        ],
        "position": [
          5,
          -20,
          8
        ]
      }
    }
  ]
}
```

### The article asset entry

```json
{
    "assetDirectory": "./media/af0ra7hg0ae99r9eaggds43wg/",
    "obj": "ScanLAB_Projects_SM_ZombieBoy_170000_v02.OBJ",
    "mtl": "ScanLAB_Projects_SM_ZombieBoy_TEXTURE.mtl",
    "assetType": "model",
    "nameText": "Zombie Boy",
    "sourceText": "",
    "developer_comments": "Model is approx x: -10, 10 y: 36, -36 z: -5, 5",
    "position": [-48, 0, -25],
    "rotation": [270, 0, 0],
    "scale": 20,
    "background": ["#8c8c76", "#000000"],
    "hotspot_inactive": "#DED4BC",
    "hotspot_active": "#80809c"
}
```

* **assetDirectory** This is the directory inside `public/media` where all assets for the 3D Model should be placed
* **obj / mtl** These are the 3D Model and texture files that are loaded by the Kiosk interface
* **assetType** Does what is says on the tin (The KMS uses this to indicate that it should extract assets to the given directory)
* **developer_comments** Just used to leave comments for developers who will come along later and add more hotspots etc.
* **position / rotation** The position that the 3D model is placed in the scene and how it is rotated
* **scale** Resize the 3D Model
* **background** The background of the scene, an array for a linear top down gradient
* **hotspot_inactive / hotspot_active** Colors used for the hotspots


### Title Subpage

```json
{
  "pageID": "5-3-1",
  "type": "title",
  "asset": {
    "assetType": "image",
    "assetSource": "./media/01.jpg"
  },
  "title": "Self-Conscious Gene by Marc Quinn",
  "content": [
    "Quinn’s sculpture portrays Rick Genest, an actor, artist and model from Canada, known for covering his entire body in anatomical tattoos.",
    "Explore the artwork in detail to find out more about Rick’s life, how the statue was made, and the history of tattooing."
  ],
  "camera": {
    "position": [121, 8, -16],
    "rotation": [0, 20, 200]
  }
}
```

* **asset** This image asset is used to populate the MenuItem in the main menu
* **camera** The initial position and rotation of the camera in the scene (The debug output in the top left corner is useful for setting this up)


### Hot Spots

```json
{
  "pageID": "5-3-3",
  "type": "hotspot",
  "title": "Brain Surgery",
  "content": [
    "Rick developed a brain tumour in his early teens. After successful surgery he began to have anatomical imagery tattooed on to his body.",
    "His head shows a visible brain above a distinct line, as if the skull and scalp have been lifted off."
  ],
  "camera": {
    "position": [25.25999781797079,52.04203059684709,-10.15613016228794],
    "rotation": [0, 20, 200]
  },
  "hotspot": {
    "focus": [0, 30, 0],
    "position": [0, 38, 0]
  }
}
```

* **camera** The rotation and position that the camera should move to
* **hotspot.focus** The point in space that the camera will rotate around
* **hotspot.position** The actual position of the hotspot in the scene

## Importing to the KMS

I'll go through the process of importing the zombie boy 3d model to give you an idea of
how to import your own, or edit an existing model in the KMS.

### Prepping the Asset files

Any files you want to use should be added to a .tar.gz file. For the zombie boy model I used the following:

```

```

Prep a separate image to use as the menu title image. 

### Creating the custom page model

SSH to a box hosting the application and connected to the database and enter the application folder.

```shell script
$ php artisan tinker
Psy Shell v0.9.9 (PHP 7.3.7-2+ubuntu16.04.1+deb.sury.org+1 — cli) by Justin Hileman
>>> $zombieBoy = new CustomPage
=> App\CustomPage {#3429}
>>> $zombieBoy->name = '3D Model - Zombie Boy';
=> "3D Model - Zombie Boy"
>>> $zombieBoy->data = [];
=> []
>>> $zombieBoy->save()
=> true
>>> $zombieBoy->id
=> <custompage.id>
```

Make a note of the ID of the custom page, we will use this in the next steps.

### Importing the asset files

You should upload the asset archive and title menu image to an application server. Then change to the application directory.

```shell script
$ scp ./public/media/zombieboy-assets.tar.gz kiosk-staging:~
$ scp ./public/media/zombieboy-title-image.jpeg kiosk-staging:~
$ ssh kiosk-staging
$ cd /var/www/kiosk_manager
$ php artisan tinker
Psy Shell v0.9.9 (PHP 7.3.7-2+ubuntu16.04.1+deb.sury.org+1 — cli) by Justin Hileman
>>> $zombieBoy = CustomPage::find(<custompage.id>);
>>> $zombieBoy->addMedia('/home/ubuntu/zombieboy-assets.tar.gz')->toMediaCollection('assets');
>>> $zombieBoy->addMedia('/home/ubuntu/zombieboy-title-image.jpeg')->toMediaCollection('assets');
```

### Adding the page data

Make a copy of your custom page data in a separate file from the `manifest.json` file.

Remove all of the `pageID` and `articleID` properties from the JSON.

#### Title Image

Update the `titleImage` section with the media id generated when you ran `$zombieBoy->addMedia` 
to upload the image.

```json
{
  "titleImage": {
    "assetType": "image",
    "assetId": <media.id>,
    "assetMime": "image\/jpeg",
    "assetFilename": "zombie-boy.jpeg"
  }
}
```

#### 3D Model

Remove the `assetDirectory` property for the 3D model asset, but leave the other properties intact. 

```json
{
  "asset": {
    "assetId": <media.id>,
    "assetMime": "application/zip",
    "assetFilename": "zombie-boy.zip",
    "obj": "ScanLAB_Projects_SM_ZombieBoy_170000_v02.OBJ",
    "mtl": "ScanLAB_Projects_SM_ZombieBoy_TEXTURE.mtl",
    "assetType": "model",
    "nameText": "Zombie Boy",
    "sourceText": "",
    "developer_comments": "Model is approx x: -10, 10 y: 36, -36 z: -5, 5",
    "position": [-48, 0, -25],
    "rotation": [270, 0, 0],
    "scale": 20,
    "background": ["#8c8c76", "#000000"],
    "hotspot_inactive": "#DED4BC",
    "hotspot_active": "#80809c"
  }
}
```

#### Adding the data to the custom page

To add the model data to the custom page, we need to insert 

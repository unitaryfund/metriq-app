# Simple React Footer

Simple React Footer is an open-source React.js component. It is a ready to use footer for your React application.

## Preview

![mainFooter](https://res.cloudinary.com/ditqevvs5/image/upload/v1605490234/simple-react-footer/mainFooter_jlg0hy.png)

### Smaller Screen Preview

![smallerScreen](https://res.cloudinary.com/ditqevvs5/image/upload/v1605490234/simple-react-footer/smallerscreen_zywlze.png)

## Install

```
npm install simple-react-footer
```

## Pass in your data as props

| Prop | Type | Description |
| :---: | :---: | :---: |
| title | `String` | Required. This is the title for the first column. This is an ideal place for the company's name or "About" title. |
| description | `String` | Required. This is the description about your company or any other text you would like to include in the footer. The recommended length is up to 450 characters. |
| columns | `Array` | Optional. This is an array of column objects (defined below) for extra lists of resources.  Each list has a title and link items |
| linkedin | `String` | Optional. Linkedin name. Only include the actual name of the linkedin page. Ex: `fluffycat` |
| facebook | `String` | Optional. Facebook name. Only include the actual name of the facebook page. Ex: `catsfbpage` |
| instagram | `String` | Optional. Instagram name. Only include the actual name of the instagram page. Ex: `fluffy_cat` |
| twitter | `String` | Optional. Twitter name. Only include the actual name of the twitter page. Ex: `fluffy_cat_in_twitter` |
| youtube | `String` | Optional. Youtube name. Include your youtube channel's path after `channel/`. Ex: `UCFt6TSF464J8K82xeA?` |
| pinterest | `String` | Optional. Pinterest name. Only include the actual name of the pinterest page. Ex: `fluffy_cats_collections` |
| copyright | `String` | Required. This is the copyright name. This could be the company's name or developer's name(s) |
| iconColor | `String` | Optional. This is the color of the social media icons. If not specified, the default color is black. |
| backgroundColor | `String` | Optional. This is the color of the footer's background. If not specified, the default color is bisque. |
| fontColor | `String` | Optional. This is the color of the font. If not specified, the default color is black. |
| copyrightColor | `String` | Optional. This is the color of the copyright text. If not specified, the default color is grey. |


### Column Object

| Prop | Type | Description |
| :---: | :---: | :---: |
| title | `String` | Required. This is the title for the column. |
| resources | `Array` | Required. This is an array of objects with `name` ank `link` for each list item. |
| resources.name | `String` | Required. Parameter for the resource. This is the name of the list item. |
| resources.link | `String` | Required. Parameter for the resource. This is the link for the link item. |

### Render might look like this

```
import SimpleReactFooter from "simple-react-footer";
...

render() {
  const description = "According to wikipedia, the cat (Felis catus) is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family. A cat can either be a house cat, a farm cat or a feral cat; the latter ranges freely and avoids human contact.";
  const title = "Cats";
  const columns = [
    {
        title: "Resources",
        resources: [
            {
                name: "About",
                link: "/about"
            },
            {
                name: "Careers",
                link: "/careers"
            },
            {
                name: "Contact",
                link: "/contact"
            },
            {
                name: "Admin",
                link: "/admin"
            }
        ]
    },
    {
        title: "Legal",
        resources: [
            {
                name: "Privacy",
                link: "/privacy"
            },
            {
                name: "Terms",
                link: "/terms"
            }
        ]
    },
    {
        title: "Visit",
        resources: [
            {
                name: "Locations",
                link: "/locations"
            },
            {
                name: "Culture",
                link: "/culture"
            }
        ]
    }
 ];
 return <SimpleReactFooter 
    description={description} 
    title={title}
    columns={columns}
    linkedin="fluffy_cat_on_linkedin"
    facebook="fluffy_cat_on_fb"
    twitter="fluffy_cat_on_twitter"
    instagram="fluffy_cat_live"
    youtube="UCFt6TSF464J8K82xeA?"
    pinterest="fluffy_cats_collections"
    copyright="black"
    iconColor="black"
    backgroundColor="bisque"
    fontColor="black"
    copyrightColor="darkgrey"
 />;
};
```



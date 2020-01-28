// find objects in a Tiled layer that containt a property called "type" equal to a certain value
export function findObjectsByType(type, map) {
    return map.objects["Object Layer"].filter(element => {
        if (element.type === type) {
            //Phaser uses top left, Tiled bottom left so we have to adjust the y position
            //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            //so they might not be placed in the exact pixel position as in Tiled
            //console.log("Found " + element.type);
            //element.y -= map.tileHeight
            element.y -= element.height;
            element.properties = element.properties || {};
            Object.values(element.properties).forEach(prop => {
                if (prop && prop.name) element.properties[prop.name] = prop.value
            })
            return element
        }
    })
}

export function findObjectByName(name, type, map) {
    return findObjectsByType(type, map).find(el => el.name === name)
}
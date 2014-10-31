document.customBlocks = document.customBlocks || [];
document.customBlockList = document.customBlockList || [];

///////////////////////////////////////////////////
// -> insert custom block definitions here       //
document.customBlocks.push({test: {type: 'command', category: 'looks', spec: 'test %s'}});
document.customBlockList.push({category: 'looks', block: 'test'});
SpriteMorph.prototype.test = function (text) {
    alert("It works! " + text);
};
// end of insert, you can ignore the stuff below //
///////////////////////////////////////////////////

// helper functions
function objects_merge(a, b) {
    var res = {};
    for (var aattrname in a) {res[aattrname] = a[aattrname];}
    for (var battrname in b) {res[battrname] = b[battrname];}
    return res;
}

function block(selector) {
    var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
    newBlock.isTemplate = true;
    return newBlock;
}

if(!SpriteMorph.prototype.wasBlockTemplates) {
    SpriteMorph.prototype.wasBlockTemplates = SpriteMorph.prototype.blockTemplates;
    // re-define template function to inject custom blocks
    SpriteMorph.prototype.blockTemplates = function (category) {
        blocks = this.wasBlockTemplates(category);
        document.customBlockList.forEach(function (cblock) {
            if(cblock.category == category) {
                blocks.push(block(cblock.block));
            }
        });
        return blocks;
    };
}

if(!SpriteMorph.prototype.wasInitBlocks) {
    SpriteMorph.prototype.wasInitBlocks = SpriteMorph.prototype.initBlocks;
    // re-define block initialization function
    SpriteMorph.prototype.initBlocks = function () {
        this.wasInitBlocks();
        document.customBlocks.forEach(function (extBlock) {
            SpriteMorph.prototype.blocks = objects_merge(SpriteMorph.prototype.blocks, extBlock);
        });
    };
}

// refresh the palettes
world.children.forEach(function (child) {
    child.flushPaletteCache(); // TODO cache clearing does not work like expected
    child.refreshPalette();
    child.sprites.asArray().forEach(function (sprite) {
        sprite.initBlocks();
    });
});

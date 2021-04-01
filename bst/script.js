class Node {
    //Constants
    RADIUS = 50;
    CHILDPOS = 35.4;
    STARTEDGE = 14.14;

    //Attributes
    leftNode = null;
    rightNode = null;

    constructor(value, paper, parentX=250, parentY=100 - 3 * this.CHILDPOS, direction=0) {
        this.value = value;
        this.paper = paper;
        this.direction = direction;
        this.centreX = parentX + 3 * this.CHILDPOS * direction;
        this.centreY = parentY + 3 * this.CHILDPOS; 
        this.parentX = parentX;
        this.parentY = parentY;
    }

    updateVisualProperties(parentX=250, parentY=100 - 3 * this.CHILDPOS, direction=0) {
        this.direction = direction;
        this.centreX = parentX + 3 * this.CHILDPOS * direction;
        this.centreY = parentY + 3 * this.CHILDPOS; 
        this.parentX = parentX;
        this.parentY = parentY;
    }

    spaceAvailable(newValue) {
        if (newValue >= this.value && !this.rightNode) {
            return true;
            //this.rightNode = new Node(newValue, this.centreX, this.centreY, 1);
        
        } else if (newValue < this.value && !this.leftNode) {
            return true;
            //this.leftNode = new Node(newValue, this.centreX, this.centreY, -1);
        
        } else {
            return false;
        }
    }
}

class BinarySearchTree {
    //Constants
    RADIUS = 50;
    CHILDPOS = 35.4;
    STARTEDGE = 14.14;

    constructor(paper) {
        this.paper = paper;
    }

    addNode(newValue) {
        //If the root node isn't set
        if (!this.rootNode) {
            this.rootNode = new Node(newValue, this.paper);
            this.canvasAddNode(this.rootNode, false);

        //Otherwise, traverse the tree until a node is found where it can be inserted
        } else {
            var currentNode = this.rootNode;
            while (!currentNode.spaceAvailable(newValue)) {
                if (newValue >= currentNode.value) {
                    currentNode = currentNode.rightNode;
                
                } else {
                    currentNode = currentNode.leftNode;
                }
            }

            //Decide whether to insert the new node as a left or right child
            if (newValue >= currentNode.value) {
                currentNode.rightNode = new Node(newValue, this.paper, currentNode.centreX, currentNode.centreY, 1);
                //Show on screen
                this.canvasAddNode(currentNode.rightNode);
            
            } else {
                currentNode.leftNode = new Node(newValue, this.paper, currentNode.centreX, currentNode.centreY, -1);
                //Show on screen
                this.canvasAddNode(currentNode.leftNode);
            }   
        }
    }

    removeNode(valueToRemove) {
        //Find the node with the value being removed
        let currentNode = this.rootNode;
        let parentNode = null;

        //While the node to remove hasn't been found
        while (currentNode && currentNode.value != valueToRemove) {
            //Track the node above the current node
            parentNode = currentNode;

            //Get new node depending on whether node's value is less than or greater than value to be deleted
            if (valueToRemove >= currentNode.value) {
                currentNode = currentNode.rightNode;
            
            } else {
                currentNode = currentNode.leftNode;
            }
        }

        //If the current node is null, the item to be deleted doesn't exist
        if (!currentNode) {
            throw new Error("Value '" + valueToRemove + "' cannot be deleted as it does not exist");

        } else {
            //If the node to be deleted has no child nodes...
            if (!currentNode.leftNode && !currentNode.rightNode) {
                //If the node to be deleted is the root node, the tree is now empty
                if (currentNode == this.rootNode) {
                    this.rootNode = null;
                    //Remove root node from canvas
                    this.canvasRemoveNode(currentNode);
                }
                //Remove the reference to this node from the parent node
                else if (parentNode.leftNode == currentNode) {
                    parentNode.leftNode = null;
                
                } else {
                    parentNode.rightNode = null;
                }

                //Remove only this node from the canvas
                this.canvasRemoveNode(currentNode);

            //If the node to be deleted has one child node...
            } else if (!currentNode.leftNode || !currentNode.rightNode) {
                let childNode = null;
                let direction = null;
                //Find the single child node of the node to be deleted
                if (currentNode.leftNode) {
                    childNode = currentNode.leftNode;

                } else {
                    childNode = currentNode.rightNode;
                }

                //If the node to be deleted is the root, the child becomes the root
                if (currentNode == this.rootNode) {
                    //Recursively remove the child node
                    this.removeNode(childNode.value);
                    //Swap their values
                    currentNode.value = childNode.value;

                    //Alter the displayed text of the current node
                    this.alterCanvasText(currentNode);

                } else {
                    //If the node to be deleted is the left child of the parent node
                    if (parentNode.leftNode == currentNode) {
                        direction = -1
                        //Make the parent node's left pointer reference the child of the deleted node
                        parentNode.leftNode = childNode;
                    
                    } else {
                        direction = 1
                        //Make the parent node's right pointer reference the child of the deleted node
                        parentNode.rightNode = childNode;
                    }
                    //Remove the node to be deleted from the canvas
                    this.canvasRemoveNode(currentNode);
                    //Remove the child of the deleted node from the canvas
                    this.canvasRemoveNode(childNode);

                    //Update child node's properties before re-drawing it
                    childNode.updateVisualProperties(parentNode.centreX, parentNode.centreY, direction);

                    //Re-add the child of the deleted node to the canvas
                    this.canvasAddNode(childNode);
                }

            //If the node to be deleted has two children, use the Hibbard deletion algorithm...
            } else {
                //Find the 'successor' of the node to be deleted (smallest value in right subtree)
                let successor = currentNode.rightNode;
                //While there are smaller values in the subtree
                while (successor.leftNode) {
                    //Update the successor
                    successor = successor.leftNode;
                }
                //Recursively delete the successor node
                this.removeNode(successor.value);
                //Swap the values of the node to be deleted and the successor
                currentNode.value = successor.value;

                //Alter the displayed text of the current node
                this.alterCanvasText(currentNode);

            }

        }
    }

    alterCanvasText(node) {
        let textObject = node.drawnNode[1];
        //Alter the text attribute to display the new node value
        textObject.attr({text: node.value});
    }

    canvasAddNode(node, addEdge=true) {
        const nodeSet = this.paper.set();
        //Add the child to the canvas on screen
        const circle = this.paper.circle(node.centreX, node.centreY, 20);
        circle.attr({fill: '#FFFFFF', stroke: '#2F5597', 'stroke-width': 5});
        const text = this.paper.text(node.centreX, node.centreY, node.value);
        text.attr({'font-size': 4, 'font-family': 'Univers, Arial, sans-serif'});
        //Animate circle
        circle.animate({'r': this.RADIUS}, 500, 'bounce');

        text.animate({'font-size': 28}, 500, 'bounce');
        if (addEdge) {
            var startX = node.parentX + this.STARTEDGE * node.direction;
            var startY = node.parentY + this.STARTEDGE; //- 2 * this.CHILDPOS;
            var path = this.paper.path("M " + startX + " " + startY + " l " + (node.direction * this.CHILDPOS) + " " + this.CHILDPOS);
            
            var transformedPath = Raphael.transformPath("M " + startX + " " + startY + " l " + (node.direction * this.CHILDPOS) + " " + this.CHILDPOS, 'T ' + (node.direction * 20) + ',20');
            path.attr({stroke: '#2F5597', 'stroke-width': 5});
            path.animate({path: transformedPath}, 500, 'bounce');

            //Group into a set and add as a class attribute
            nodeSet.push(
                circle,
                text,
                path
            );

        } else {
            nodeSet.push(
                circle,
                text
            );
        }
        
        //Add hover event handlers for nodes
        nodeSet.hover(function() {
            //Make the outline red
            circle.attr({stroke: '#C00000'});

            //Make cursor change to pointer
            nodeSet.attr({cursor: 'pointer'});
        },

        function() {
            //Make the outline blue again
            circle.attr({stroke: '#2F5597'});
        });

        //Add click event handlers for nodes, so that they can be deleted
        nodeSet.click(() => this.removeNode(node.value));

        //Assign as class attribute
        node.drawnNode = nodeSet;

        //Update canvas width
        this.updateCanvas(this.paper);
    }

    canvasRemoveNode(node) {
       //Remove the set storing the visual representation of the root node
       node.drawnNode.remove();  
    }

    //Sleep for the number of seconds specified
    sleep(delay) {
        return new Promise(resolve => setTimeout(resolve, delay * 1000));
    }

    //Recursive function to perform a pre-order traversal of the tree
    async preOrder(node) {
        //Make the outline of the node green
        node.drawnNode[0].attr({stroke: '#70AD47'});

        //Sleep for 2 seconds
        await this.sleep(2);

        //Make the outline of the node blue again
        node.drawnNode[0].attr({stroke: '#2F5597'});


        let nodeValue = node.value;
        //If the current node isn't the first node to be output, add a separator between it and the previous node
        if (document.getElementById("traversalOutput").innerHTML) {
            nodeValue = ", " + nodeValue;
        }

        //Output the value of the node
        document.getElementById("traversalOutput").innerHTML += nodeValue;

        //Recursively traverse to the left and to the right
        if (node.leftNode) {
            await this.preOrder(node.leftNode);
        }

        if (node.rightNode) {
            await this.preOrder(node.rightNode);
        }
    }

    //Recursive function to perform an in-order traversal of the tree
    async inOrder(node) {
        //Recursively traverse to the left
        if (node.leftNode) {
            await this.inOrder(node.leftNode);
        }

        let nodeValue = node.value;
        //If the current node isn't the root node, add a separator between it and the previous node
        if (document.getElementById("traversalOutput").innerHTML) {
            nodeValue = ", " + nodeValue;
        }

        //Make the outline of the node green
        node.drawnNode[0].attr({stroke: '#70AD47'});

        //Sleep for 2 seconds
        await this.sleep(2);

        //Make the outline of the node blue again
        node.drawnNode[0].attr({stroke: '#2F5597'});

        //Output the value of the node
        document.getElementById("traversalOutput").innerHTML += nodeValue;

        //Recursively traverse to the right
        if (node.rightNode) {
            await this.inOrder(node.rightNode);
        }
    }

    //Recursive function to perform a post-order traversal of the tree
    async postOrder(node) {
        //Recursively traverse to the left
        if (node.leftNode) {
            await this.postOrder(node.leftNode);
        }

        //Recursively traverse to the right
        if (node.rightNode) {
            await this.postOrder(node.rightNode);
        }

        let nodeValue = node.value;
        //If the current node isn't the root node, add a separator between it and the previous node
        if (document.getElementById("traversalOutput").innerHTML) {
            nodeValue = ", " + nodeValue;
        }

        //Make the outline of the node green
        node.drawnNode[0].attr({stroke: '#70AD47'});

        //Sleep for 2 seconds
        await this.sleep(2);

        //Make the outline of the node blue again
        node.drawnNode[0].attr({stroke: '#2F5597'});

        //Output the value of the node
        document.getElementById("traversalOutput").innerHTML += nodeValue;
    }

    //Counts the number of nodes in the tree
    countNodes(node) {
        //Add together the totals for each child to this node
        if (node) {
            return 1 + this.countNodes(node.leftNode) + this.countNodes(node.rightNode);
        } else {
            return 0
        }
    }

    //Recursive function to get the minimum x position of the centres of nodes
    getMinX(node) {
        if (node) {
            //Return the minimum of this node's children's x values and this node's
            return Math.min(node.centreX, this.getMinX(node.leftNode), this.getMinX(node.rightNode));

        } else {
            return 100000;
        }
    }

    //Recursive function to get the maximum x position of the centres of nodes
    getMaxX(node) {
        if (node) {
            //Return the maximum of this node's children's x values and this node's
            return Math.max(node.centreX, this.getMaxX(node.leftNode), this.getMaxX(node.rightNode));

        } else {
            return -100000;
        }
    }

    updateCanvas(paper) {
        //If there is more than 3 nodes
        if (this.countNodes(this.rootNode) > 3) {
            //Get the minimum and maximum x-coordinates of nodes
            let minX = this.getMinX(this.rootNode);
            let maxX = this.getMaxX(this.rootNode);

            //Multiply the difference between these by 50 to get the canvas width
            const canvasWidth = 600 + 5 * ((maxX - minX) / 5);

            //Update the canvas width
            paper.setViewBox(-400 + minX, 0, canvasWidth, canvasWidth, true);
        }
    }
}

function validateInput(nodeToAdd) {
    //If the input is empty
    if (!nodeToAdd) {
        throw new Error("You must specify a node to add");
    }

    //If the input is too long
    if (nodeToAdd.length > 6) {
        throw new Error("The value of a node must not exceed 6 characters in length");
    }
}

function addNodeFromInput() {
    //Reset the error message text
    document.getElementById("errorText").innerHTML = "";
    try {
        //Get the node to add from the input text box
        nodeToAdd = document.forms["addNodeForm"].nodeValue.value;

        //Validate the input before adding it as a node
        validateInput(nodeToAdd);

        //Add the node to the tree
        tree.addNode(nodeToAdd);

    } catch(err) {
        //Display any error messages
        document.getElementById("errorText").innerHTML = err.message;
    }

    //Clear input text
    document.forms["addNodeForm"].nodeValue.value = "";
}

//Make the tree a global variable that can be acted upon by functions
var tree;

window.onload = function() {
    var paper = new Raphael(document.getElementById('canvas_container'), '100%', '100%');
    paper.setViewBox(-100, 0, 700, 700, true);

    var svg = document.querySelector("svg");
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    tree = new BinarySearchTree(paper);
}
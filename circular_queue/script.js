
//Provides drawing related functionality
class DrawnObject {
    //Convert the polar coordinates r,θ to Cartesian coordinates x,y
    polarToCartesian(radius, angle) {
        //Convert angle in degrees to radians
        const radiansAngle = angle * (Math.PI / 180);
        //x = rcosθ
        const x = radius * Math.cos(radiansAngle);
        //y = rsinθ
        const y = radius * Math.sin(radiansAngle);

        //Return the coordinates (x,y)
        return [x, y];
}
}

class Node extends DrawnObject {
    //Constants
    START_RADIUS = 200;
    END_RADIUS = 300;

    constructor(paper, startAngle, endAngle) {
        super();
        this.paper = paper;
        this.startAngle = startAngle;
        this.endAngle = endAngle
        //this.direction = direction;
        //this.centreX = parentX + 3 * this.CHILDPOS * direction;
        //this.centreY = parentY + 3 * this.CHILDPOS; 
        //this.parentX = parentX;
        //this.parentY = parentY;
    }

    //Check if the node has an assigned value
    hasValue() {
        if (this.value) {
            return true;
        } else {
            return false;
        }
    }

    //Set the value of the node
    setValue(newValue) {
        //Assign to the class attribute
        this.value = newValue

        //Update text on canvas
        this.updateCanvasText();
    }

    updateCanvasText() {
        //Get text from set
        const text = this.drawnNode[4];
        //Update text attribute
        text.attr({text: this.value});

        //Set initial text size
        text.attr({'font-size': 4, 'font-family': 'Univers, Arial, sans-serif'});

        //Animate text to increase in size
        text.animate({'font-size': 28}, 500, 'bounce');
    }
    
    addToCanvas() {
        //Get the four coordinate pairs required for the paths to be drawn
        const topLeftCoords = this.polarToCartesian(this.END_RADIUS, this.startAngle);
        const topRightCoords = this.polarToCartesian(this.END_RADIUS, this.endAngle);
        const bottomLeftCoords = this.polarToCartesian(this.START_RADIUS, this.startAngle);
        const bottomRightCoords = this.polarToCartesian(this.START_RADIUS, this.endAngle);

        //Draw the outer arc that enclose a node of the circular queue
        const outerPathString = [
            "M", topLeftCoords[0], topLeftCoords[1],
            "A", this.END_RADIUS, this.END_RADIUS, 0, 0, 1, topRightCoords[0], topRightCoords[1]
        ].join(" ");

        let outerArc = this.paper.path(outerPathString);

        //Draw the inner arc
        const innerPathString = [
            "M", bottomLeftCoords[0], bottomLeftCoords[1],
            "A", this.START_RADIUS, this.START_RADIUS, 0, 0, 1, bottomRightCoords[0], bottomRightCoords[1]
        ].join(" ");

        let innerArc = this.paper.path(innerPathString);
        
        //Draw the two lines connecting the arcs
        const leftLineString = [
            "M", bottomLeftCoords[0] /*- 1*/, bottomLeftCoords[1] /*+ 1*/,
            "L", topLeftCoords[0] /*+ 1*/, topLeftCoords[1] /*+ 1*/
        ].join(" ");

        let leftLine = this.paper.path(leftLineString);

        const rightLineString = [
            "M", bottomRightCoords[0] /*- 1*/, bottomRightCoords[1] /*- 1*/,
            "L", topRightCoords[0] /*+ 1*/, topRightCoords[1] /*- 1*/
        ].join(" ");

        let rightLine = this.paper.path(rightLineString);

        //Add text in the center of the two main arcs
        const centerAngle = (this.startAngle + this.endAngle) / 2;
        const centerRadius = (this.START_RADIUS + this.END_RADIUS) / 2;
        const textCoords = this.polarToCartesian(centerRadius, centerAngle);
        //Initially, the text is empty
        const text = this.paper.text(textCoords[0], textCoords[1], "");

        //Group objects together into a set
        const nodeSet = this.paper.set()
        nodeSet.push(outerArc, 
            leftLine, 
            innerArc, 
            rightLine,
            text
        );

        //Assign set as class attribute
        this.drawnNode = nodeSet;

        //Apply styling to group
        //nodeSet.attr({stroke: '#2F5597', 'stroke-width': 3});
        outerArc.attr({stroke: '#2F5597', 'stroke-width': 3});
        leftLine.attr({stroke: '#2F5597', 'stroke-width': 3});
        innerArc.attr({stroke: '#2F5597', 'stroke-width': 3});
        rightLine.attr({stroke: '#2F5597', 'stroke-width': 3});
    }
}

class Pointer extends DrawnObject {
    constructor(dataArray, queueSize, paper, colour, value, radius) {
        super();
        this.colour = colour;
        this.value = value;
        this.queueSize = queueSize;
        this.paper = paper;
        this.radius = radius;

        this.drawPointer(dataArray);
    }

    setValue(newValue) {
        this.value = newValue;
    }

    getValue() {
        return (this.value + this.queueSize) % this.queueSize;
    }

    drawPointer(dataArray) {
        //Create a new circle above the node the pointer references
        const referencedNode = dataArray[(this.value + this.queueSize) % this.queueSize];   //Add queue size before taking mod in case value is -1
        const pointerAngle = (referencedNode.startAngle + referencedNode.endAngle) / 2;

        //Get the x,y coordinates of the pointer
        const pointerCoords = this.polarToCartesian(this.radius, pointerAngle);

        //Draw the text
        //const pointerText = this.paper.text(textCoords[0], textCoords[1], this.name);

        //Initially set text as small...
        //pointerText.attr({'font-size': 4, 'font-family': 'Univers, Arial, sans-serif'});
        const circle = this.paper.circle(pointerCoords[0], pointerCoords[1], 1);
        //...then animate to grow in size
        //pointerText.animate({'font-size': 20}, 500, 'bounce');
        circle.attr({fill: this.colour, 'stroke-width': 0});
        //Animate circle
        circle.animate({'r': 5}, 500, 'bounce');

        //Assign the drawn circle as a class attribute
        this.drawnPointer = circle;
    }

    //Update the position of the pointer
    updatePointerPos(dataArray) {
        //Get the x,y coordinates above the node referenced by the pointer
        const referencedNode = dataArray[(this.value + this.queueSize) % this.queueSize];    //Add queue size before taking mod in case value is -1
        const pointerAngle = (referencedNode.startAngle + referencedNode.endAngle) / 2;

        //Get the x,y coordinates of the pointer
        const pointerCoords = this.polarToCartesian(this.radius, pointerAngle);

        //Update the attributes of the drawn node and initially make the circle small...
        this.drawnPointer.attr({cx: pointerCoords[0], cy: pointerCoords[1], r:0});

        //...then animate to grow in size
        this.drawnPointer.animate({'r': 5}, 500, 'bounce');
    }

}

class CircularQueue {
    //Stores node objects in the queue
    dataArray = [];

    constructor(paper, size) {
        this.paper = paper;
        this.size = size;

        //Create node objects to fill data array and display on canvas
        let startAngle = -90;
        const angleIncrement = 360 / size;
        //Angle is rounded to nearest integer to deal with small floating point errors
        while (Math.round(startAngle + angleIncrement) <= 270) {
            var node = new Node(paper, startAngle, startAngle + angleIncrement);
            node.addToCanvas();

            //Add node to array
            this.dataArray.push(node);

            startAngle += angleIncrement;
        }
        //Define pointers
        this.head = new Pointer(this.dataArray, this.size, paper, "#2F5597", 0,  325);
        this.tail = new Pointer(this.dataArray, this.size, paper, "#C00000", -1, 350); 
    }

    enqueueItem(newItem) {
        if (!this.isFull()) {
            //Increment the tail pointer modulo the queue size
            this.tail.setValue((this.tail.getValue() + 1) % this.size);

            //Store at the location given by the tail pointer
            this.dataArray[this.tail.getValue()].setValue(newItem); 

            //Update tail pointer on canvas
            this.tail.updatePointerPos(this.dataArray);

        //Throw error if queue is full
        } else {
            throw new Error("Queue is full - item cannot be enqueued");
        }
    }

    dequeueItem() {
        if (!this.isEmpty()) {
            //Reset the text stored at the head of the queue
            this.dataArray[this.head.getValue()].setValue("");

            //Increment the head pointer modulo the queue size
            this.head.setValue((this.head.getValue() + 1) % this.size);

            //Update head pointer on canvas
            this.head.updatePointerPos(this.dataArray);

        //Throw error if queue is empty    
        } else {
            throw new Error("Queue is empty - item cannot be dequeued");
        }
    }

    //Check if the queue is full
    isFull() {
        //The node at the head must have a value for the queue to be full
        if (this.dataArray[this.head.getValue()].hasValue() && (this.tail.getValue() + 1) % this.size == this.head.getValue()) {
            return true;
        } else {
            return false;
        }
    }

    //Check if the queue is empty
    isEmpty() {
        //The node at the tail must NOT have a value for the queue to be empty
        if (!this.dataArray[this.tail.getValue()].hasValue() && (this.head.getValue() - 1) % this.size == this.tail.getValue()) {
            return true;
        } else {
            return false;
        }
    }
    
    /*canvasAddNode(node, addEdge=true) {
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
    }*/

    //Sleep for the number of seconds specified
    sleep(delay) {
        return new Promise(resolve => setTimeout(resolve, delay * 1000));
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

function enqueueFromInput() {
    //Reset the error message text
    document.getElementById("errorText").innerHTML = "";

    try {
        //Get the node to add from the input text box
        itemToEnqueue = document.forms["enqueueItemForm"].newItem.value;

        //Validate the input before enqueuing the item
        validateInput(itemToEnqueue);

        //Enqueue the item
        circularQueue.enqueueItem(itemToEnqueue);

    } catch(err) {
        //Display any error messages
        document.getElementById("errorText").innerHTML = err.message;
    }

    //Clear input text
    document.forms["enqueueItemForm"].newItem.value = "";
}

function dequeueFromInput() {
    //Reset the error message text
    document.getElementById("errorText").innerHTML = "";

    try {
        //Enqueue the item
        circularQueue.dequeueItem();

    } catch(err) {
        //Display any error messages
        document.getElementById("errorText").innerHTML = err.message;
    }
}

function drawLegend(paper) {
    //Define symbols to represent the head and tail of the queue
    const headCircle = paper.circle(300, 300, 0);
    headCircle.attr({fill: "#2F5597", 'stroke-width': 0});
    const headText = paper.text(350, 300, "Head");
    headText.attr({'font-size': 4, 'font-family': 'Univers, Arial, sans-serif'});

    const tailCircle = paper.circle(300, 350, 0);
    tailCircle.attr({fill: "#C00000", 'stroke-width': 0});
    const tailText = paper.text(342, 350, "Tail");
    tailText.attr({'font-size': 4, 'font-family': 'Univers, Arial, sans-serif'});


    //Animate the elements of the legend
    headCircle.animate({'r': 5}, 500, 'bounce');
    headText.animate({'font-size': 20});

    tailCircle.animate({'r': 5}, 500, 'bounce');
    tailText.animate({'font-size': 20});
}

//Make the circular queue a global variable that can be acted upon by functions
var circularQueue;

window.onload = function() {
    var paper = new Raphael(document.getElementById('canvas_container'), '100%', '100%');
    paper.setViewBox(-400, -400, 800, 800, true);

    var svg = document.querySelector("svg");
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    //Draw a legend
    drawLegend(paper);

    circularQueue = new CircularQueue(paper, 7);
}
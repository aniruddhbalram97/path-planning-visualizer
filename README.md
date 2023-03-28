## PathVis

Based visualizer for Path-Planning Algorithms developed using ReactJS. 

### Dependencies:
1) NodeJS 
2) React-Bootstrap

### Build and Run:
```
# After doing a git pull, cd into pathfinder folder
cd <your_directory>/pathfinder

# Install all the dependencies
npm install

# Run the web-app
npm start
```

### Instructions:
1) Choose start and end goals by clicking on the grid. Once selected, they can't be changed. To change just refresh the app.
2) Once start and end goals are selected, hold mouse and drag around the grid to make any obstacles.
3) Choose a path-planning algorithm from dropdown. Currently only the following algorithms are supported:
    - Breadth-First Search
    - Depth-First Search (Still under works)
    - Greedy Best Search
    - A* Search
    - Dijkstra's Search
4) Click on Visualize to view the visualization. 

### Results:
![Alt Text](./src/PathVis_tutorial.gif)

### Future Work:
1) Add more Algorithms
2) Ability to clear start and end goals
3) Pre-defined maps
4) Add a defined tutorial
5) Show time-taken for completion
6) Add Modals explaining some algorithms
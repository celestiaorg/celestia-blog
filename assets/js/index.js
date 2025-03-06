// JavaScript files are compiled and minified during the build process to the assets/built folder. See available scripts in the package.json file.

// Import CSS
import "../css/index.css";

// Import JS - import directTruncate first to ensure it runs as early as possible
import "./directTruncate.js"; // Direct import, no need for named import since it's self-executing
import infiniteScroll from "./infiniteScroll";
import menuOpen from "./menuOpen";

// Call the menu and infinite scroll functions
menuOpen();
infiniteScroll();

// No need to call truncation function as directTruncate.js is self-executing

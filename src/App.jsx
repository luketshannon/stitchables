import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LandingPage from "pages/LandingPage"
import ProjectsPage from "pages/ProjectsPage"
import ProjectPage from "pages/ProjectPage"
import TokenPage from "pages/TokenPage"
import UserPage from "pages/UserPage"
import Providers from "components/Providers"
import EventsPage from "./pages/EventsPage"
import AboutPage from "./pages/AboutPage"
import TermsOfServicePage from "./pages/TermsOfServicePage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import { useEffect, useRef } from "react";

function App() {
  //////// LUKE CODE ///////////////////////////////////////////////////////

  // OPTIMIZATIONS

  // throttle / debounce mouse updates (e.g. only every 50ms)
  // update MAX_POSITIONS number of existing svgs rather than removing and reattaching
  // speed up distance calculations via precalculated underlying grid of radius sqrt(MAX_DISTANCE_SQ)
  // limit DOM elements

  const MAX_DISTANCE_SQ = Math.pow(100, 2); // Constant for maximum distance
  const MAX_POSITIONS = 10; // Maximum number of positions to track
  const mousePositions = useRef([]); // Using useRef to persist the array across renders

  // Function to calculate distance between two points
  const distanceSq = (x1, y1, x2, y2) => {
    return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
  };

  // Function to visualize bounding boxes and draw lines
  const visualizeBoundingBox = (rect) => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'absolute';
    overlay.style.border = '1px solid black';
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);

    // Calculate corners of bounding box
    const corners = [
      { x: rect.left, y: rect.top },
      { x: rect.left + rect.width, y: rect.top },
      { x: rect.left, y: rect.top + rect.height },
      { x: rect.left + rect.width, y: rect.top + rect.height },
    ];

    mousePositions.current.forEach(({ x: mouseX, y: mouseY }) => {
      corners.forEach((corner) => {
        if (distanceSq(mouseX, mouseY, corner.x, corner.y) < MAX_DISTANCE_SQ) {
          // Create SVG line element
          const svgNS = "http://www.w3.org/2000/svg";
          const line = document.createElementNS(svgNS, 'line');
          line.setAttribute('x1', mouseX.toString());
          line.setAttribute('y1', mouseY.toString());
          line.setAttribute('x2', corner.x.toString());
          line.setAttribute('y2', corner.y.toString());
          line.setAttribute('stroke', 'black');
          line.setAttribute('stroke-width', '0.5');

          const svg = document.createElementNS(svgNS, 'svg');
          svg.style.position = 'absolute';
          svg.style.top = '0';
          svg.style.left = '0';
          svg.style.width = '100%';
          svg.style.height = '100%';
          svg.style.pointerEvents = 'none';
          svg.appendChild(line);

          document.body.appendChild(svg);
        }
      });
    });
  };

  // Function to clear existing overlays and lines
  const clearVisualizations = () => {
    document.querySelectorAll('.overlay, svg').forEach((element) => {
      element.remove();
    });
  };

  // Function to compute bounding boxes and draw lines
  const computeVisualizations = (event) => {
    clearVisualizations();

    // Update mouse positions
    mousePositions.current.push({ x: event.clientX, y: event.clientY });
    if (mousePositions.current.length > MAX_POSITIONS) {
      mousePositions.current.shift(); // Remove the oldest position
    }

    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      visualizeBoundingBox(rect);
    });
  };

  // Compute visualizations initially
  computeVisualizations({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });

  // Recompute visualizations on mouse movement
  document.addEventListener('mousemove', computeVisualizations);

  // Cleanup event listener when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', computeVisualizations);
    };
  }, []); // Empty dependency array ensures setup happens once



  //////// END LUKE CODE ///////////////////////////////////////////////////////
  return (
    <Providers>
      <Router>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="collection" element={<ProjectsPage />} />
          <Route path="project/:contractAddress/:projectId" element={<ProjectPage />} />
          <Route path="token/:contractAddress/:id" element={<TokenPage />} />
          <Route path="user/:walletAddress" element={<UserPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="termsOfService" element={<TermsOfServicePage />} />
          <Route path="privacyPolicy" element={<PrivacyPolicyPage />} />
        </Routes>
      </Router>
      <ToastContainer
        autoClose={10000}
        position="bottom-right"
        theme="dark"
        newestOnTop
        pauseOnHover
        pauseOnFocusLoss
      />
    </Providers>
  )
}

export default App

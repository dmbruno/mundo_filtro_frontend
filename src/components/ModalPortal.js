// src/components/ModalPortal.js
import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  const portalRoot = document.getElementById("portal-root");
  return createPortal(children, portalRoot);
};

export default ModalPortal;
import express from "express";
import { fetchProjectTrackingTestReport, updateProjectTrackingTestReport } from "../controllers/testController.js";

const router = express.Router();

router.get("/project_tracking_test_report", fetchProjectTrackingTestReport);

router.post("/project_tracking_test_report_edit", updateProjectTrackingTestReport)

export default router;

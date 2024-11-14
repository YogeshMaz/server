import fetchReportData from "../components/FetchReportAPIData.js";
import getAccessToken from "../accessToken/checkAuthExpiration.js";

import { AppNames } from "../zohoAssets/AppLists.js";

/** Add Visit **/
export const fetchProjectTrackingTestReport = async (req, res) => {
  try {
    const appName = AppNames.PM;
    const reportName = "Project_Tracking_Test_Report";
    const access_token = await getAccessToken();
    const data = await fetchReportData(appName, reportName, access_token);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer RFQs" });
  }
};

export const updateProjectTrackingTestReport = async (req, res) => {
  try {
    console.log(req.body);
    
    // Get and print the current date
    const requestDate = new Date();
    console.log("Request Date:", requestDate);

    // const appName = AppNames.PM;
    // const reportName = "Project_Tracking_Test_Report";
    // const access_token = await getAccessToken();
    // const data = await fetchReportData(appName, reportName, access_token);
    
    res.json({ message: "Data fetched successfully", date: requestDate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer RFQs" });
  }
};

import axios from 'axios';
import 'dotenv/config';

const ship24Token = process.env.SHIP24_AUTH;

/**
 * Fetch Ship24 tracking details for a specific tracking number
 * @param {Object} req - The request object from the client
 * @param {Object} res - The response object to be sent back
 */
export const fetchShip24 = async (req, res) => {
  // Prepare the request data and configuration
  const data = JSON.stringify({
    "trackingNumber": "5301324501"  // Hardcoded tracking ID
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.ship24.com/public/v1/tracking/search',
    headers: { 
      'Authorization': 'Bearer ' + ship24Token, // Replace with your actual API token
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    // Make the API request using await
    const response = await axios.request(config);

    // Log and send the response data as JSON
    // console.log("Ship24 Response Data:", response.data);
    res.json(response.data);

  } catch (error) {
    // Log the error and send an error response
    console.error("Error fetching Ship24 details:", error.message);
    res.status(500).json({
      message: "Error fetching Ship24 details",
      error: error.message
    });
  }
};

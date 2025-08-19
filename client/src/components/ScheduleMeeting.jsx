import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
//import axios from "axios";
import api from "../api";

const HOURS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const ScheduleMeeting = ({ mentorId, menteeId }) => {
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUnavailableSlots = async () => {
      try {
        const response = await api.get(`/users/mentors/${mentorId}/unavailable-slots`);
        console.log("Unavailable slots:", response.data);
        setUnavailableSlots(response.data);
      } catch (err) {
        console.error("Failed to fetch unavailable slots", err);
      }
    };

    fetchUnavailableSlots();
  }, [mentorId]);

  const isSlotTaken = (selectedDate, selectedTime) => {
    return unavailableSlots.some((slot) => {
      const slotDate = new Date(slot.meeting_date).toLocaleDateString("sv-SE");
      const slotTime = slot.meeting_time.slice(0, 5);
      return slotDate === selectedDate && slotTime === selectedTime;
    });
  };

  const handleSubmit = async () => {
    if (!date || !time) return;
    if (isSlotTaken(date, time)) {
      alert("This slot is already taken.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/mentee/home", {
        mentorId,
        meetingDate: date,
        meeting_time: time
      });
      setSuccess("Meeting request sent!");
      setDate("");
      setTime("");
    } catch (err) {
      console.error("Failed to schedule meeting", err);
      setSuccess("Failed to schedule meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={3} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Schedule a Meeting
      </Typography>

      <TextField
        label="Select Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Select Time"
        select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        disabled={!date}
      >
        {HOURS.map((hour) => {
          const disabled = !date || isSlotTaken(date, hour);
          return (
            <MenuItem key={hour} value={hour} disabled={disabled}>
              {hour}
            </MenuItem>
          );
        })}

      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || !date || !time}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Request"}
      </Button>

      {success && (
        <Typography mt={2} color="secondary">
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default ScheduleMeeting;

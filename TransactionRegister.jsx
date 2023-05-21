import React, { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../dashboard/Header";

import {
  Box,
  Button,
  useTheme,
  TextField,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import SuccessModal from "../global/sucessmodal";

const TransactionRegister = () => {
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);
  const [expense, setExpense] = useState({
    type: "expense",
    category: "",
    amount: "",
    vendor: "",
    date: new Date(),
  });
  const [expenses, setExpenses] = useState([]);
  const [tempExpenses, setTempExpenses] = useState([]);

  const handleInputChange = (event) => {
    setExpense({
      ...expense,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    console.log(`state of tempExpenses: ${tempExpenses}`);
    console.log(`state of expenses: ${expenses}`);
  }, [tempExpenses, expenses]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTempExpenses([...tempExpenses, { ...expense, id: tempExpenses.length }]);
    setExpense({
      type: "expense",
      category: "",
      amount: "",
      vendor: "",
      date: new Date(),
    });
  };

  const handleConfirm = async () => {
    try {
      // Check if there are any expenses to confirm
      if (tempExpenses && tempExpenses.length > 0) {
        // Send a POST request to the /expenses endpoint
        // If there's only one expense, send it as an object
        // If there are multiple expenses, send them as an array
        const response = await axios.post(
          "http://localhost:3000/expenses",
          tempExpenses.length === 1 ? tempExpenses[0] : tempExpenses
        );

        // Check if the request was successful
        if (response.status === 201) {
          // Update the expenses state and reset the tempExpenses state
          // setExpenses((prevExpenses) => [...prevExpenses, ...tempExpenses]);
          setIsPostSuccessful(true);
          setExpenses([]);
          setTempExpenses([]);
        } else {
          // Handle error
          console.error("Error posting expenses:", response);
        }
      } else {
        console.log("No expenses to confirm");
      }
    } catch (error) {
      console.error("Error posting expenses:", error);
    }
  };
  const handleCloseModal = () => {
    setIsPostSuccessful(false);
  };

  const resetTable = () => {
    setExpenses([]);
    setTempExpenses([]);
  };

  const columns = [
    { field: "vendor", headerName: "Vendor Name", width: 200 },
    { field: "type", headerName: "Expense Type", width: 200 },
    { field: "amount", headerName: "Amount", width: 200 },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
  ];

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Box height="90vh">
        <Header title="Finance Management" subtitle="Register Transactions" />
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <form
              onSubmit={handleSubmit}
              style={{
                color: "lightgray",
                m: "0 auto",
                background: colors.blueAccent[700],
                padding: "5px",
                borderRadius: "5px",
              }}>
              <div
                className="formhead"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "56px",
                  maxHeight: "56px",
                  lineHeight: "56px",
                  background: colors.primary[600],
                }}>
                <Typography variant="h6" color={colors.primary[700]}>
                  Expense Details
                </Typography>
              </div>
              <TextField
                label="Paid To"
                type="text"
                name="vendor"
                value={expense.vendor}
                onChange={handleInputChange}
                required
                sx={{ marginTop: "1em" }}
                fullWidth
              />
              <FormControl sx={{ marginTop: "1em" }} fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={expense.category}
                  onChange={handleInputChange}
                  required>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="compliance">Compliance</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="travel">Travel</MenuItem>
                  <MenuItem value="utility">Utility</MenuItem>
                  <MenuItem value="procurement">Procurement</MenuItem>
                  <MenuItem value="inventory">Inventory</MenuItem>
                  <MenuItem value="payroll">Payroll</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Amount"
                type="number"
                name="amount"
                value={expense.amount}
                onChange={handleInputChange}
                required
                sx={{ marginTop: "1em" }}
                fullWidth
              />
              <div
                className="btnGroup"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  minHeight: "56px",
                  maxHeight: "56px",
                  lineHeight: "56px",
                  padding: "0 1em",
                  margin: "1em 0  0.5em 0",
                  borderTop: "1px solid rgba(255, 255, 255, 0.32)",
                }}>
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<DeleteIcon />}
                  style={{ marginTop: "1em", display: "flex" }}
                  onClick={resetTable}>
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  type="submit"
                  style={{ marginTop: "1em", display: "flex" }}>
                  Submit
                </Button>
              </div>
            </form>
          </Grid>
          <Grid item xs={8}>
            <div
              className="exhistory"
              style={{
                color: "lightgray",
                m: "0 auto",
                background: colors.blueAccent[700],
                padding: "5px",
                borderRadius: "5px",
              }}>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={[...expenses, ...tempExpenses]}
                  columns={columns}
                  pageSize={5}
                />
              </div>
              {tempExpenses && (
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<CheckIcon />}
                  type="submit"
                  style={{ marginTop: "1em", display: "flex" }}
                  onClick={handleConfirm}>
                  Confirm
                </Button>
              )}

              {isPostSuccessful && <SuccessModal onClose={handleCloseModal} />}
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default TransactionRegister;

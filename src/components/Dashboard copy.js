import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import axios from "axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
   const [validationReports, setValidationReports] = useState([]);
  const token = localStorage.getItem("ps_token");
   const [assignedBy, setAssignedBy] = useState({}); 
    const [filterStatus, setFilterStatus] = useState('All');
   const [searchTerm, setSearchTerm] = useState('');

   const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

 const filteredApplications = applications.filter(app => {
    const status = (app.status || '').replace(/\s+/g, '').toLowerCase();
    const filter = (filterStatus || '').replace(/\s+/g, '').toLowerCase();

    // Status filter
    let statusMatch = false;
    if (filter === 'all' || filter === 'selectstatus') statusMatch = true;
    else if (filter === 'pending') statusMatch = status === 'pending';
    else if (filter === 'inprogress') statusMatch = status === 'inprogress';
    else if (filter === 'returned' || filter === 'return') statusMatch = status === 'returned' || status === 'return';

    // Search filter
    const term = searchTerm.trim().toLowerCase();
    let searchMatch = true;
    if (term) {
      searchMatch =
        (app.applicant_name || '').toLowerCase().includes(term) ||
        (app.mobile_number || '').toLowerCase().includes(term) ||
        (`F${String(app.id).padStart(3, '0')}`).toLowerCase().includes(term);
    }

    return statusMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
const paginatedApplications = filteredApplications.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setApiError("");
      try {
        const token = localStorage.getItem("ps_token");
        const response = await fetch(
          "https://lampserver.uppolice.co.in/arms/ps-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.status) {
          // Sort in descending order by id
          const sortedApplications = data.data.sort((a, b) => b.id - a.id);
          setApplications(sortedApplications);
        } else {
          setApiError("Failed to fetch applications.");
        }
      } catch (err) {
        setApiError("Network error. Please try again.");
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

useEffect(() => {
  const fetchValidationReports = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Use ps_token here
      const response = await fetch(
        "https://lampserver.uppolice.co.in/validation-report/list-ps",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.status) setValidationReports(data.data);
    } catch (err) {}
  };
  fetchValidationReports();
}, []);

const isReportSubmitted = (appId) =>
  validationReports.some(
    (report) =>
      report.application_id === appId && report.report_status === "submitted"
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://lampserver.uppolice.co.in/arms/application/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((prev) => prev.filter((app) => app.id !== id));
      alert("Application deleted successfully!");
    } catch (error) {
      console.error("Failed to delete application", error);
      alert("Failed to delete application");
    }
  };

   const handleAssignedByChange = (appId, value) => {
    setAssignedBy(prev => ({
      ...prev,
      [appId]: value
    }));
  };

  return (
    <div>
      <Sidebar />
      <div className="asside">
        <div className="about-first">
          <div className="row">
            <div className="col-12 mb-24">
              <div className="bg-box">
                <div className="pro-add-new px-0">
                  <p>
                     List Of Application <span>{filteredApplications.length}</span>
                  </p>
                  <div className="status-search">
                    <div>
                      <select
                        name="entryType"
                        className="form-control"
                        id="entryType"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                      >
                        <option value="Select Status">Select Status</option>
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Inprogress">In Progress</option>
                        <option value="Return">Returned</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>  
                  </div>
                </div>
                {/* Edit Modal */}
                <div
                  className="modal fade"
                  id="exampleModaledit"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Edit Grievance File
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="user-details">
                          <form>
                            <div className="form-floating mb-4 mt-2">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingName"
                                placeholder="Name"
                              />
                              <label htmlFor="floatingName">Name</label>
                            </div>
                            <div className="form-floating mb-4">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingMobile"
                                placeholder="Mobile Number"
                              />
                              <label htmlFor="floatingMobile">
                                Mobile Number
                              </label>
                            </div>
                            <div className="form-floating mb-4">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingFileNo"
                                placeholder="File No"
                              />
                              <label htmlFor="floatingFileNo">File No</label>
                            </div>
                            <div className="form-floating mb-4">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingServiceName"
                                placeholder="Service Name"
                              />
                              <label htmlFor="floatingServiceName">
                                Service Name
                              </label>
                            </div>
                            <div className="form-floating mb-4">
                              <input
                                type="date"
                                className="form-control"
                                id="floatingApplicationDate"
                                placeholder="Application Date"
                              />
                              <label htmlFor="floatingApplicationDate">
                                Application Date
                              </label>
                            </div>
                            <div className="form-floating mb-4">
                              <select
                                className="form-select form-control"
                                id="floatingStatus"
                                aria-label="Status"
                              >
                                <option selected>Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                              <label htmlFor="floatingStatus">Status</label>
                            </div>
                            <div className="upload-reset-btn mb-0 justify-content-center pt-2">
                              <button
                                className="btn btn-upload"
                                data-bs-dismiss="modal"
                              >
                                Save changes
                              </button>
                              <button
                                className="btn btn-reset me-0"
                                data-bs-dismiss="modal"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Edit Modal */}
                <div className="table-responsive table-x">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Sr No</th>
                        <th scope="col">File No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Mobile Number</th>
                        <th scope="col">Service Name</th>
                        <th scope="col">Application Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Notes</th>
                        <th scope="col">View</th>
                        <th scope="col">Assigned By</th>
                        <th scope="col">Submit Report</th>
                        <th scope="col">Send</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedApplications.map((app, idx) => (
                        <tr key={app.id}>
                          <th scope="row">{(currentPage - 1) * itemsPerPage + idx + 1}</th>
                          <td>{`F${String(app.id).padStart(3, "0")}`}</td>
                          <td>{app.applicant_name}</td>
                          <td>{app.mobile_number}</td>
                          <td>{app.service}</td>
                          <td>
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              {app.status}
                            </span>
                          </td>
                          <td>{app.ps_remarks || "-"}</td>
                          <td>
                            <Link to={`/filled-pdf/${app.id}`}>
                              <i className="fa-solid fa-eye text-success"></i>
                            </Link>
                          </td>
                          <td>
                              <select className="form-select form-select-sm mb-2"
                                    value={assignedBy[app.id] || ''}
                                    onChange={e => handleAssignedByChange(app.id, e.target.value)}>
                              <option value="">Assign By</option>
                              <option value="Gaurav Sharma">Gaurav Sharma</option>
                              <option value="Darshan Vaghani">Darshan Vaghani</option>
                              <option value="Amit Parmar">Amit Parmar</option>
                            </select>
                            </td>
                          <td>
                            {isReportSubmitted(app.id) ? (
                              <Link
                                to={`/ps-report/${app.id}`} target='_blank'
                                className="btn btn-success btn-sm"
                              >
                                View Report
                              </Link>
                            ) : (  
                              <Link
                                to={`/validation-report/${app.id}?assignedBy=${encodeURIComponent(assignedBy[app.id] || '')}`}
                                className="btn btn-primary btn-sm"
                              >
                                Submit Report
                              </Link>
                            )}
                          </td>

                        <td>
                         <button
                              className="btn btn-info btn-sm text-white"
                            >
                              <i className="fa-solid fa-paper-plane me-1"></i>
                              ACP
                            </button>
                          </td> 
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pro-add-new px-0 mb-0 pt-3">
      <p>
        {filteredApplications.length === 0
          ? "No records"
          : `${(currentPage - 1) * itemsPerPage + 1} - ${
              Math.min(currentPage * itemsPerPage, filteredApplications.length)
            } of ${filteredApplications.length}`}
      </p>
      <nav aria-label="...">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;

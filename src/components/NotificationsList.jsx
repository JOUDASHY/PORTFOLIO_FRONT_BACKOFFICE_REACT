import React, { useEffect, useState } from "react";

import axiosClient from "../axiosClient";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/notifications/")
      .then((response) => {
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sortedNotifications);
      })
      .catch((error) => console.error("Erreur lors du chargement des notifications:", error))
      .finally(() => setLoading(false));
  }, []);

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, is_read: true }))
    );
    setUnreadCount(0);
    // Optionally send a request to mark notifications as read in the backend
    axiosClient.post("/notifications/mark-all-read/").catch((error) => {
      console.error("Error marking notifications as read:", error);
    });
  };

  const clearAllNotifications = async () => {
    try {
      await axiosClient.delete("notifications/clear-all/");
      setNotifications([]); // Efface après confirmation
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-header bg-warning text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Notifications</h5>
          <button className="btn btn-light btn-sm" onClick={markAllAsRead}>
           Mark all read
          </button>
        </div>
        <div className="card-body" style={{ maxHeight: "600px", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center">
            loading ...
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-muted text-center">Aucune notification</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`alert ${notif.is_read ? "alert-light" : "alert-primary"} d-flex align-items-start`}>
                <div className="me-2">
                  <i className="fas fa-bell text-primary"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">{notif.title}</h6>
                  <p className="mb-1">{notif.message}</p>
                  <small className="text-muted">{new Date(notif.created_at).toLocaleString()}</small>
                </div>
                {!notif.is_read && <span className="badge bg-danger ms-2">Nouveau</span>}
              </div>
            ))
          )}
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-danger btn-sm" onClick={clearAllNotifications}>
            Clear all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsList;

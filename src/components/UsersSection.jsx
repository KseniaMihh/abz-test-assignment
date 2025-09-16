import React, { useEffect, useState } from "react";

const UsersSection = ({ refreshTrigger = 0 }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE_URL = "https://frontend-test-assignment-api.abz.agency/api/v1";
  const USERS_PER_PAGE = 6;

  const fetchUsers = async (page = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/users?page=${page}&count=${USERS_PER_PAGE}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const sortedUsers = data.users.sort(
          (a, b) => b.registration_timestamp - a.registration_timestamp,
        );

        if (reset) {
          setUsers(sortedUsers);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...sortedUsers]);
        }

        setCurrentPage(data.page);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, true);
  }, []);

  useEffect(() => {
    if (refreshTrigger > 0) {
      setCurrentPage(1);
      fetchUsers(1, true);
    }
  }, [refreshTrigger]);

  const handleShowMore = async () => {
    if (currentPage < totalPages && !loading) {
      await fetchUsers(currentPage + 1);
    }
  };

  const truncateText = (text, maxLength = 25) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+380") && cleaned.length === 13) {
      return `+38 (0${cleaned.slice(4, 6)}) ${cleaned.slice(6, 9)} ${cleaned.slice(9, 11)} ${cleaned.slice(11, 13)}`;
    }

    return phone;
  };

  const showMoreButton = currentPage < totalPages;

  return (
    <section id="UsersSection" className="users-section">
      <div className="users-container">
        <div>
          <h1
            style={{
              textAlign: "center",
              marginTop: "140px",
              marginBottom: "50px",
            }}
          >
            Working with GET request
          </h1>
        </div>

        {users.length > 0 && (
          <>
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-avatar">
                    <img
                      src={user.photo}
                      alt={`Avatar of ${user.name}`}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f59e0b&color=ffffff`;
                      }}
                    />
                  </div>
                  <p className="user-name">{truncateText(user.name)}</p>
                  <p className="user-position">{user.position}</p>
                  <p
                    className="user-email"
                    data-full-email={user.email.length > 30 ? user.email : ""}
                  >
                    {truncateText(user.email, 30)}
                  </p>
                  <p className="user-phone">{formatPhoneNumber(user.phone)}</p>
                </div>
              ))}
            </div>

            {showMoreButton && (
              <div
                className="show-more-container"
                style={{ justifySelf: "center" }}
              >
                <button
                  onClick={handleShowMore}
                  disabled={loading}
                  className="btn btn-show-more"
                >
                  {loading ? "Loading..." : "Show more"}
                </button>
              </div>
            )}
          </>
        )}

        {loading && users.length === 0 && (
          <div className="loading-initial">
            <p>Loading users...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UsersSection;

import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const [del, setDelete] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({
    name: "",
    mail: "",
    year: "",
    course: "",
    address: "",
    phone: "",
  });
  const handleUpdate = () => {
    toast.loading("Processing", {
      duration: 5000,
    });
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api/update",
      data: { newData: data, id: id },
    })
      .then(function (response) {
        toast.success("Updated Successfully");
        window.location.reload(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleLogout = () => {
    setLogout(true);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token === "") {
      navigate("/");
    }
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api",
      data: { token: token },
    })
      .then(function (response) {
        const id = response.data.userid;
        setId(id);
        axios({
          method: "post",
          baseURL: "http://localhost:5000",
          url: "/api/profile",
          data: { id: id },
        })
          .then((res) => {
            console.log(res);
            setData(res.data.data);
          })
          .catch((err) => console.log(err));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCancel = () => {
    setLogout(false);
    setDelete(false);
  };

  const handleDelete = () => {
    setDelete(true);
  };

  const handleLogoutAcc = () => {
    localStorage.setItem("token", JSON.stringify(""));
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api/logout",
      data: { id: id },
    })
      .then((res) => {
        toast.success("Logged out successfully!");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteAcc = () => {
    axios({
      method: "post",
      baseURL: "http://localhost:5000",
      url: "/api/deleteAccount",
      data: { id: id },
    })
      .then(function (response) {
        localStorage.setItem("token", JSON.stringify(""));
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div id={styles.profilePage}>
      <div id={styles.profileContainer}>
        <div
          id={styles.logoutblur}
          onClick={() => {
            setLogout(false);
            setDelete(false);
          }}
          style={logout || del ? { display: "block" } : { display: "none" }}
        />
        <div
          id={styles.logout}
          style={logout || del ? { display: "block" } : { display: "none" }}
        >
          <div id={styles.logoutTitle}>
            {del ? "Delete " : "Log out from "}your Account
          </div>
          <div id={styles.logoutContext}>
            Are you sure that you want to{" "}
            {del ? "delete your account permanently" : "logout?"}
          </div>
          <div id={styles.logoutBTNS}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={logout ? handleLogoutAcc : handleDeleteAcc}>
              {del ? "Delete" : "Logout"}
            </button>
          </div>
        </div>

        <span id={styles.profileTitle}>
          <span>Profile</span>
          <Link to="/">{"<-"} back</Link>
        </span>
        <div className={styles.profileAttribute}>
          <span>Name</span>
          <span>:</span>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Mail</span>
          <span>:</span>
          <input
            style={{ cursor: "default" }}
            name="mail"
            value={data.mail}
            defaultValue={data.mail}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Year</span>
          <span>:</span>
          <input
            type="number"
            name="year"
            value={data.year}
            onChange={handleChange}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Course</span>
          <span>:</span>
          <input
            type="text"
            name="course"
            value={data.course}
            onChange={handleChange}
          />
        </div>
        <div className={styles.profileAttribute}>
          <span>Address</span>
          <span>:</span>
          <input name="address" value={data.address} onChange={handleChange} />
        </div>
        <div className={styles.profileAttribute}>
          <span>Phone</span>
          <span>:</span>
          <input
            name="phone"
            type="number"
            value={data.phone}
            onChange={handleChange}
          />
        </div>
        <div id={styles.profileBtns}>
          <button type="button" onClick={handleUpdate}>
            Update
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div id={styles.deleteZone}>
          <span>Danger Zone</span>
          <p>
            You can delete your account permanently by clicking this button.
          </p>
          <p>
            This action cannot be undone, so be careful with deleting your
            account
          </p>
          <button type="button" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

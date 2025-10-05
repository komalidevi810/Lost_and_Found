import React, { useEffect, useState } from "react";
import { setConstraint } from "../constraints";
import Navbar from "../Components/Navbar";
import "../css/feed.css";
import "../css/item_card.css";
import Axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function Feed() {
  const [user_info] = useState(JSON.parse(localStorage.getItem("user")));
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  setConstraint(true);

  // ✨ Helper Component for Truncated Text
  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    return (
      <p style={{ fontSize: "1rem" }}>
        {isReadMore ? text.slice(0, 50) : text}
        {text.length > 50 && (
          <span
            onClick={() => setIsReadMore(!isReadMore)}
            className="read-or-hide"
            style={{ color: "blue", cursor: "pointer" }}
          >
            {isReadMore ? " ...read more" : " show less"}
          </span>
        )}
      </p>
    );
  };

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/getitem`)
      .then((res) => {
        const data = res.data.postitems || [];
        const reversed = data.reverse();

        const lost = [];
        const found = [];

        reversed.forEach((item) => {
          const date = new Date(item.createdAt);
          const formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

          const isUserItem = item.createdBy === user_info?._id;

          // Construct image path for Render (local upload)
          const imageUrl =
            item.itemPictures && item.itemPictures[0]
              ? `${process.env.REACT_APP_API_BASE_URL}/uploads/${item.itemPictures[0].img}`
              : "/default-placeholder.png"; // fallback

          const card = (
            <a
              key={item._id}
              href={`/${item.name}?cid=${item._id}&type=${item.type}/${isUserItem}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Col md={3} style={{ marginTop: "2%" }}>
                <Card bsPrefix="item-card">
                  <Card.Img variant="top" src={imageUrl} />
                  <Card.Body bsPrefix="card-body">
                    <Card.Title
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                      }}
                    >
                      Item: {item.name}
                    </Card.Title>
                    {item.description && (
                      <Card.Text
                        style={{
                          fontFamily: "'Noto Sans JP', sans-serif",
                          fontSize: "1rem",
                        }}
                      >
                        Description: <ReadMore>{item.description}</ReadMore>
                      </Card.Text>
                    )}
                    <Card.Text
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      Created at: {formattedDate}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </a>
          );

          // Divide items based on type
          if (item.type === "Lost" && item.status === true) {
            lost.push(card);
          } else {
            found.push(card);
          }
        });

        setLostItems(lost);
        setFoundItems(found);
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, [user_info]);

  return (
    <div>
      <Navbar />
      <h2
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        Welcome {user_info?.firstname || "User"} 👋!
      </h2>

      <Container fluid>
        <h2 style={{ textAlign: "center" }}>Lost Items :</h2>
        <div className="title-border"></div>
        <Row>{lostItems}</Row>
      </Container>

      <Container fluid>
        {foundItems.length > 0 && (
          <>
            <h2 style={{ textAlign: "center", marginTop: "30px" }}>
              Found Items :
            </h2>
            <div className="title-border"></div>
            <Row>{foundItems}</Row>
          </>
        )}
      </Container>
    </div>
  );
}

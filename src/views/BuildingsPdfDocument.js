import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import buildingImg from "../images/default-building.jpg";
import "../styles/styles.css";

const PDFDocument = ({ buildings }) => {
  // Register font
  Font.register({ family: "Roboto" });

  // Reference font
  const styles = StyleSheet.create({
    title: {
      fontFamily: "Roboto",
    },
  });

  if (buildings === undefined) {
    return (
      <Document>
        <Page>
          <View>
            <Text>Sem dados</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page>
        {buildings.map((building) => (
          <View key={buildings.id} style={{ alignItems: "center", backgroundColor: 'rgb(238, 234, 234)', borderRadius: "10px", margin: '10px' }}>
            <Image
              src={buildingImg}
              alt="Building"
              style={{
                marginBottom: "5px",
                height: "200px",
                width: "350px",
                borderRadius: "10px",
              }}
            />
            <Text style={{ fontSize: "10px" }}>{building.address}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PDFDocument;

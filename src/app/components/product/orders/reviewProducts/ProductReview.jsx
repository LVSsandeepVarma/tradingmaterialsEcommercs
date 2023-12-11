/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Modal,
  Box,
  Typography,
  Rating,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { hideLoader, showLoader } from "../../../../../features/loader/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const ProductReviewModal = (props) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(3);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [baseUrls, setBaseUrls] = useState([]);
  const [titleErr, setTitleErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [imgErr, setImgErr] = useState("")
  const [apiErr, setApiErr] = useState();
  const [successMsg, setsuccessmsg] = useState("");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.user?.value);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setTitle("");
    setRating(3);
    setTitleErr("");
    setDescription("");
    setDescriptionErr("");
    setsuccessmsg("");
    setApiErr();
    setImages([]);
    setBaseUrls([]);
    setOpen(false);
  };

  const handleChangeRating = (event, newValue) => {
    setRating(newValue);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    if (event.target.value == "") {
      setTitleErr("Review title is requried");
    } else {
      setTitleErr("");
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    if (event.target.value == "") {
      setDescriptionErr("Description is requried");
    } else {
      setDescriptionErr("");
    }
  };

  // const onDrop = useCallback(
  //   (acceptedFiles) => {
  //     const imageFiles = acceptedFiles
  //       .filter((file) => file.type.startsWith("image/"))
  //       .slice(0, 5 - images.length)
  //       .map((file) => {
  //         if (file?.size > 30000) {
  //           setImgErr("Image should be within 3mb")
  //           console.log("exceeded")
  //           setTimeout(() => {
  //             setImgErr("")
  //           }, 2000)
  //           return null
  //         }
  //         else {
  //           console.log(file.size, "exceeded")
  //         }
  //       });
  //     console.log("exceeded", imageFiles)
  //     const base64Encoded = imageFiles.map((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         console.log(reader.result);
  //         setBaseUrls((prev) => [...prev, reader.result]);
  //       };
  //       if (file) {
  //         reader.readAsDataURL(file);
  //       }
  //     });
  //     const newImages = imageFiles.map((file) => {
  //       const url = URL.createObjectURL(file);
  //       return url;
  //     });
  //     setImages((prevImages) => [...prevImages, ...newImages]);

  //   },
  //   [setImages, setBaseUrls]
  // );

const onDrop = useCallback(
  async (acceptedFiles) => {
    const newImages = [];

    for (const file of acceptedFiles) {
      if (file.type.startsWith("image/")) {
        if (file.size > 3000000) {
          setImgErr("Image should be within 3mb");
          console.log("exceeded");
          setTimeout(() => {
            setImgErr("");
          }, 2000);
        } else {
          console.log(file.size, "within limit");
          const base64Encoded = await readFileAsDataURL(file);
          setBaseUrls((prev) => [...prev, base64Encoded]);
          newImages.push(URL.createObjectURL(file));
        }
      }
    }
console.log(baseUrls, "exceeded")
    setImages((prevImages) => [...prevImages, ...newImages]);
  },
  [setImages, setBaseUrls]
);

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: true,
    maxSize: 3000000, // 3MB limit 1000000
  });

  const handleSubmit = async (e) => {
    // Send the review data to the server
    e.preventDefault();
    if (title == "") {
      setTitleErr("Title is requried");
    }
    if (description == "") {
      setDescriptionErr("Description is required");
    }
    if (
      title != "" &&
      titleErr == "" &&
      description != "" &&
      descriptionErr == ""
    ) {
      try {
        dispatch(showLoader());
        const token = localStorage.getItem("client_token");
        const response = await axios.post(
          "https://admin.tradingmaterials.com/api/client/product/post-review",
          {
            client_id: userData?.client?.id,
            rating: rating,
            product_id: props?.product_id,
            title: title,
            description: description,
            review_file: baseUrls,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response?.data?.status) {
          setsuccessmsg("Review submitted successfully");
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
      } catch (err) {
        console.log(err);
        setApiErr(err?.response?.data?.message);
        setTimeout(() => {
          setApiErr();
        }, 2000);
      } finally {
        dispatch(hideLoader());
      }
    }
    console.log({
      rating,
      title,
      description,
      images,
      baseUrls,
    });
  };

  return (
    <>
      <Button onClick={handleOpen}>Review Product</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        }}
      >
        <Box
          sx={{
            width: {
              xs: "95%", // Mobile
              sm: "50%", // Tablet
              md: "30%", // Desktop
            },
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h5" component="h2">
            Review Product
          </Typography>

          <Box sx={{ my: 2 }}>
            <div>
              <small>Rate the product</small>
            </div>
            <Rating
              name="rating"
              value={rating}
              onChange={handleChangeRating}
              precision={1}
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <div className="form-control-wrap">
              <input
                id="title"
                label="Title"
                className="form-control"
                placeholder="Enter your review title"
                value={title}
                onChange={handleTitleChange}
              />
              {titleErr && (
                <p className="text-red-600 my-1 text-xs">{titleErr}</p>
              )}
            </div>
          </Box>

          <Box sx={{ my: 2 }}>
            <div className="from-control-wrap">
              <textarea
                className="form-control"
                type="textarea"
                id="description"
                label="Description"
                placeholder="Enter your review description"
                value={description}
                onChange={handleDescriptionChange}
                rows={3}
                style={{ height: "auto", minHeight: "auto" }}
              />
              {descriptionErr && (
                <p className="text-red-600 my-1 text-xs">{descriptionErr}</p>
              )}
            </div>
          </Box>

          <Box sx={{ my: 2 }}>
            <div {...getRootProps()} style={dropzoneStyles}>
              <input {...getInputProps()} />
              <Stack direction="column" alignItems="center">
                <IconButton style={{ cursor: "pointer" }}>
                  <CloudUploadOutlined />
                </IconButton>
                <Typography>Upload Images</Typography>
              </Stack>
            </div>

            {images.length > 0 && (
              <Stack className="my-2" direction="horizontal" spacing={2}>
                {images.map((image, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -5,
                        color: "white",
                        borderRadius: "50%",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
              </Stack>
            )}
            {imgErr && (
              <p className="text-red-600 text-xs text-start">{imgErr}</p>
            )}
          </Box>

          <Box sx={{ my: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Review
            </Button>
          </Box>
          <Box sx={{ my: 2 }}>
            {successMsg && (
              <p className="text-green-600 text-xs te">{successMsg}</p>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const dropzoneStyles = {
  border: "2px dashed #aaaaaa",
  borderRadius: "2px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default ProductReviewModal;

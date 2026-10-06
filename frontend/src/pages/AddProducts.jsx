
import { useState } from "react";
import toast from "react-hot-toast";

import ProductForm from "../components/seller/ProductForm";
import { createProduct } from "../services/productService";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageData: null,
    condition: "GOOD",
    listingType: "ITEM",
    defects: "",
    pickupLocation: "",
    course: "",
    subject: "",
    semester: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: Number(formData.categoryId),
        imageData: formData.imageData,
        condition: formData.condition,
        listingType: formData.listingType,
        defects: formData.defects.trim() || null,
        pickupLocation: formData.pickupLocation.trim() || null,
        course:
          formData.listingType === "STUDY_MATERIAL"
            ? formData.course.trim() || null
            : null,
        subject:
          formData.listingType === "STUDY_MATERIAL"
            ? formData.subject.trim() || null
            : null,
        semester:
          formData.listingType === "STUDY_MATERIAL"
            ? formData.semester.trim() || null
            : null,
      };

      await createProduct(productData);

      toast.success("Product added successfully!");
    } catch (error) {
      console.error("PRODUCT ERROR:", error);
      console.error("BACKEND ERROR:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          "Unable to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default AddProduct;

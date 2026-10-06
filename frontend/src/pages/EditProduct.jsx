
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "../components/seller/ProductForm";
import {
  getProduct,
  updateProduct,
} from "../services/productService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await getProduct(id);
        const product = response?.data?.data ?? response?.data;

        setFormData({
          name: product.name ?? "",
          description: product.description ?? "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          categoryId: product.categoryId ?? "",
          imageData: product.imageData ?? product.imageUrl ?? null,
          condition: product.condition ?? "GOOD",
          listingType: product.listingType ?? "ITEM",
          defects: product.defects ?? "",
          pickupLocation: product.pickupLocation ?? "",
          course: product.course ?? "",
          subject: product.subject ?? "",
          semester: product.semester ?? "",
        });
      } catch (error) {
        console.error("LOAD PRODUCT ERROR:", error);
        toast.error(
          error?.response?.data?.message ||
            "Unable to load product."
        );
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      await updateProduct(id, productData);

      toast.success("Product updated successfully.");
      navigate("/seller");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      console.error("BACKEND ERROR:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold text-slate-800">
          Edit Product
        </h1>

        <ProductForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EditProduct;

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card, Modal } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import Navbar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tr } from 'date-fns/locale';

const StockEntry = () => {
  const navigate = useNavigate();
  const { addProduct, categories, getCategories, addCategory } = useContext(ProductContext);
  
  // Varsayılan kategoriler
  const defaultCategories = [
    "Et Ürünleri",
    "Bakliyat",
    "Baharat",
    "Sebze-Meyve",
    "Donuk Ürünler",
    "Tatlılar",
    "Diğer"
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    quantity: '',
    price: '',
    category: '',
    entryDate: new Date(),
    expiryDate: null
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [showNewCategoryButton, setShowNewCategoryButton] = useState(true);
  
  const { name, brand, quantity, price, category, entryDate, expiryDate } = formData;
  
  useEffect(() => {
    getCategories();
    
    // Eğer kategori yoksa, varsayılan kategorileri ekle
    setTimeout(() => {
      if (categories.length === 0) {
        defaultCategories.forEach(async (catName) => {
          try {
            await addCategory({ name: catName });
          } catch (err) {
            console.error(`Kategori eklenirken hata: ${catName}`, err);
          }
        });
      }
    }, 1000);
  }, []);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
  
  const handleEntryDateChange = (date) => {
    setFormData({ ...formData, entryDate: date });
  };
  
  const handleExpiryDateChange = (date) => {
    setFormData({ ...formData, expiryDate: date });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Ürün adı gereklidir';
    }
    
    if (!brand.trim()) {
      newErrors.brand = 'Marka gereklidir';
    }
    
    if (!quantity) {
      newErrors.quantity = 'Miktar gereklidir';
    } else if (isNaN(quantity) || Number(quantity) <= 0) {
      newErrors.quantity = 'Geçerli bir miktar giriniz';
    }
    
    if (!price) {
      newErrors.price = 'Fiyat gereklidir';
    } else if (isNaN(price) || Number(price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    
    if (!category) {
      newErrors.category = 'Kategori gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const productData = {
        ...formData,
        quantity: Number(quantity),
        price: Number(price)
      };
      
      await addProduct(productData);
      
      setSuccess('Ürün başarıyla eklendi');
      setError('');
      
      // Reset form
      setFormData({
        name: '',
        brand: '',
        quantity: '',
        price: '',
        category: '',
        entryDate: new Date(),
        expiryDate: null
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/stock-view');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Ürün eklenirken bir hata oluştu');
      setSuccess('');
    }
  };
  
  const handleOpenCategoryModal = () => {
    setShowCategoryModal(true);
    setNewCategory('');
    setCategoryError('');
  };
  
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
  };
  
  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
    if (e.target.value.trim()) {
      setCategoryError('');
    }
  };
  
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setCategoryError('Kategori adı gereklidir');
      return;
    }
    
    try {
      const result = await addCategory({ name: newCategory });
      setFormData({ ...formData, category: newCategory });
      setShowCategoryModal(false);
      
      setSuccess('Kategori başarıyla eklendi');
      setError('');
      
      // Kategorileri yeniden yükle
      getCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.msg || 'Kategori eklenirken bir hata oluştu');
    }
  };
  
  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="mb-4">Stok Giriş</h2>
        
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Card>
          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ürün Adı</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={onChange}
                      isInvalid={!!errors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Marka</Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={brand}
                      onChange={onChange}
                      isInvalid={!!errors.brand}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.brand}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Miktar</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={quantity}
                      onChange={onChange}
                      isInvalid={!!errors.quantity}
                      min="1"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.quantity}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fiyat (1 kg fiyatı)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={price}
                      onChange={onChange}
                      isInvalid={!!errors.price}
                      min="0.01"
                      step="0.01"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Kategori</Form.Label>
                    <div className="d-flex">
                      <Form.Select
                        name="category"
                        value={category}
                        onChange={onChange}
                        isInvalid={!!errors.category}
                        className="me-2"
                        required
                      >
                        <option value="">Kategori Seçin</option>
                        {defaultCategories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                        {categories
                          .filter(cat => !defaultCategories.includes(cat.name))
                          .map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))
                        }
                      </Form.Select>
                      {showNewCategoryButton && (
                        <Button variant="outline-primary" onClick={handleOpenCategoryModal}>
                          + Yeni
                        </Button>
                      )}
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giriş Tarihi</Form.Label>
                    <DatePicker
                      selected={entryDate}
                      onChange={handleEntryDateChange}
                      dateFormat="dd/MM/yyyy"
                      locale={tr}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Son Kullanma Tarihi (Opsiyonel)</Form.Label>
                    <DatePicker
                      selected={expiryDate}
                      onChange={handleExpiryDateChange}
                      dateFormat="dd/MM/yyyy"
                      locale={tr}
                      className="form-control"
                      isClearable
                      placeholderText="Son kullanma tarihi seçin"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" className="me-2" onClick={() => navigate('/stock-view')}>
                  İptal
                </Button>
                <Button variant="primary" type="submit">
                  Ürün Ekle
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        
        {/* Yeni Kategori Modal */}
        <Modal show={showCategoryModal} onHide={handleCloseCategoryModal}>
          <Modal.Header closeButton>
            <Modal.Title>Yeni Kategori Ekle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Kategori Adı</Form.Label>
              <Form.Control
                type="text"
                value={newCategory}
                onChange={handleNewCategoryChange}
                isInvalid={!!categoryError}
              />
              <Form.Control.Feedback type="invalid">
                {categoryError}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCategoryModal}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Ekle
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default StockEntry; 
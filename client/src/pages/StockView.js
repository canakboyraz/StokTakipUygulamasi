import React, { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Container, Row, Col, Table, Form, Button, Alert, Card, Badge, Modal } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const StockView = () => {
  const { products, loading, error, deleteProduct, getProducts } = useContext(ProductContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  useEffect(() => {
    getProducts();
  }, []);
  
  useEffect(() => {
    if (products) {
      // Filter products based on search term and category
      let filtered = products.filter(product => 
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory ? product.category === selectedCategory : true)
      );
      
      // Sort products by category
      filtered = filtered.sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
      });
      
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm, selectedCategory]);
  
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };
  
  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete._id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  
  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'dd MMMM yyyy', { locale: tr });
  };
  
  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };
  
  // Group products by category for display
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
  
  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="mb-4">Stok Görüntüle</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row className="mb-4">
          <Col md={8}>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            {Object.keys(groupedProducts).length === 0 ? (
              <Alert variant="info">Ürün bulunamadı</Alert>
            ) : (
              Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <Card key={category} className="mb-4">
                  <Card.Header>
                    <h4>{category}</h4>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Ürün Adı</th>
                          <th>Marka</th>
                          <th>Miktar</th>
                          <th>Birim Fiyat</th>
                          <th>Giriş Tarihi</th>
                          <th>Son Kullanma Tarihi</th>
                          <th>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryProducts.map(product => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price.toFixed(2)} TL</td>
                            <td>{formatDate(product.entryDate)}</td>
                            <td>
                              {product.expiryDate ? (
                                <div>
                                  {formatDate(product.expiryDate)}
                                  {isExpired(product.expiryDate) && (
                                    <Badge bg="danger" className="ms-2">Süresi Dolmuş</Badge>
                                  )}
                                </div>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                              >
                                <FaEdit /> Düzenle
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <FaTrash /> Sil
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ))
            )}
          </>
        )}
        
        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Ürünü Sil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            "{productToDelete?.name}" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              İptal
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Sil
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default StockView; 
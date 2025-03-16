import React, { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Container, Row, Col, Table, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const StockOutHistory = () => {
  const { stockOutHistory, loading, error, getStockOutHistory, getStockOutHistoryByDateRange } = useContext(ProductContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterError, setFilterError] = useState(null);

  useEffect(() => {
    getStockOutHistory();
  }, []);

  useEffect(() => {
    if (stockOutHistory) {
      setFilteredHistory(stockOutHistory);
    }
  }, [stockOutHistory]);

  const handleSearch = () => {
    if (!stockOutHistory) return;

    const filtered = stockOutHistory.filter(history => {
      // Search in product names and categories
      const hasMatchingItem = history.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return hasMatchingItem;
    });
    
    setFilteredHistory(filtered);
  };

  const handleDateFilter = async () => {
    if (!startDate || !endDate) {
      setFilterError('Başlangıç ve bitiş tarihlerini seçiniz');
      return;
    }

    try {
      await getStockOutHistoryByDateRange(startDate, endDate);
      setFilterError(null);
    } catch (err) {
      setFilterError('Tarih aralığına göre filtreleme sırasında bir hata oluştu');
    }
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setFilterError(null);
    getStockOutHistory();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy HH:mm', { locale: tr });
  };

  const calculateTotalCost = (items) => {
    return items.reduce((total, item) => total + item.cost, 0);
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="mb-4">Stok Çıkış Geçmişi</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {filterError && <Alert variant="danger">{filterError}</Alert>}
        
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <div className="search-container mb-3">
                  <FaSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Ürün veya kategori ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <Button variant="primary" onClick={handleSearch} className="w-100">
                  Ara
                </Button>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Başlangıç Tarihi</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bitiş Tarihi</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button variant="primary" onClick={handleDateFilter} className="w-100 mb-3">
                      <FaCalendarAlt className="me-2" />
                      Filtrele
                    </Button>
                  </Col>
                </Row>
                <Button variant="secondary" onClick={resetFilters} className="w-100">
                  Filtreleri Sıfırla
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            {filteredHistory.length === 0 ? (
              <Alert variant="info">Stok çıkış kaydı bulunamadı</Alert>
            ) : (
              filteredHistory.map((history) => (
                <Card key={history._id} className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Tarih: {formatDate(history.date)}</h5>
                    <h5 className="mb-0">Toplam Maliyet: {history.totalCost.toFixed(2)} TL</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Ürün Adı</th>
                          <th>Marka</th>
                          <th>Kategori</th>
                          <th>Miktar</th>
                          <th>Birim Fiyat</th>
                          <th>Maliyet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.productName}</td>
                            <td>{item.productBrand}</td>
                            <td>{item.category}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toFixed(2)} TL</td>
                            <td>{item.cost.toFixed(2)} TL</td>
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
      </Container>
    </>
  );
};

export default StockOutHistory; 
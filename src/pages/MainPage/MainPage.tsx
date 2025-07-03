import "./style.css";
import { useEffect, useState } from "react";
import { Table, Typography, Spin, Alert, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetProductsQuery } from "../../store/api/productsApi";
import { useDebounce } from "../../hooks/useDebounce";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;
const { Search } = Input;

// Типизация цены в валюте
interface CurrencyPrice {
  UZS?: number;
  USD?: number;
}

// Типизация stock
interface Stock {
  sellPrice?: CurrencyPrice;
}

// Основной тип продукта
interface Product {
  id: number;
  sku: string;
  supplier: string;
  barcode: string;
  productName: string;
  stocks?: Stock[];
}

const ProductsPage = () => {
  const [page, setPage] = useState<number>(1);
  const pageSize = 40;
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    size: 1000,
    subdomain: "toko",
  });

  // После загрузки данных
  useEffect(() => {
    if (data?.items) {
      setAllProducts(data.items);
      setFilteredProducts(data.items);
    }
  }, [data]);

  // Отложенная фильтрация
  useDebounce({
    callback: () => {
      if (!searchTerm) {
        setFilteredProducts(allProducts);
      } else {
        const lower = searchTerm.toLowerCase();
        const filtered = allProducts
          .filter((item) => item.productName?.toLowerCase().includes(lower))
          .sort((a, b) => {
            const aIndex = a.productName.toLowerCase().indexOf(lower);
            const bIndex = b.productName.toLowerCase().indexOf(lower);
            return aIndex - bIndex;
          });
        setFilteredProducts(filtered);
      }
    },
    delay: 1000,
    dependencies: [searchTerm, allProducts],
  });

  // Столбцы таблицы с типами
  const columns: ColumnsType<Product> = [
    {
      title: "№",
      render: (_: unknown, __: Product, index: number) =>
        (page - 1) * pageSize + index + 1,
      key: "index",
    },
    {
      title: "Поставщик",
      dataIndex: "supplier",
      key: "supplier",
    },

    {
      title: "Название продукта",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Цена",
      key: "price",
      render: (_: unknown, record: Product) => {
        const stock = record.stocks?.[0];
        const price = stock?.sellPrice?.UZS;
        return price ? price.toLocaleString("ru-RU") + " UZS" : "—";
      },
    },
    {
      title: "Штрихкод",
      dataIndex: "barcode",
      key: "barcode",
    },
  ];

  return (
    <div className="main" style={{ padding: "24px" }}>
      <div className="header">
        <Button danger onClick={handleLogout}>
          Выйти
        </Button>
      </div>
      <div
        className="header-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Список продуктов
        </Title>
      </div>

      <Search
        placeholder="Поиск по названию продукта"
        allowClear
        size="large"
        style={{ marginBottom: 16, maxWidth: 400 }}
        onSearch={(value) => setSearchTerm(value)}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error ? (
        <Alert message="Ошибка при загрузке данных" type="error" />
      ) : isLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table<Product>
          columns={columns}
          dataSource={filteredProducts.slice(
            (page - 1) * pageSize,
            page * pageSize
          )}
          rowKey="id"
          pagination={{
            current: page,
            pageSize,
            total: filteredProducts.length,
            onChange: (newPage) => setPage(newPage),
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;

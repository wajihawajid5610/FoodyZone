
import { useEffect, useState } from "react";
import styled from "styled-components";
import SearchFood from "./components/SearchFood";


export const Container = styled.div`
 max-width: 1200px;
 margin: 0 auto;
`;

const TopContainer = styled.section`
  height: 140px;
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  .search{
    input{
      background-color: transparent;
      border: 1px solid red;
      color: white;
      height: 40px;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 400;
      padding: 11px 15px; 
      &::placeholder {
        color: white;
      }  
    }
  } 
    @media (0 < width < 600px){
      display: flex;
      flex-direction: column;
      height: 120px;
    }
`;

const FilterContainer = styled.section`
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-bottom: 18px;     
  `;

export const Button = styled.button` 
      padding: 6px 12px;
      color: white;
      border-radius: 5px;
      border: none;
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
      &:hover{
        background-color: #f22f2f;
      }
      background: ${({ isSelected }) => (isSelected ? "#f22f2f" : "#ff4343")};
      outline: 1px solid ${({ isSelected }) => (isSelected ? "white" : "#ff4343")};
  `;

export const BASE_URL = 'http://localhost:9000';
function App() {

  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedBtn, setSelectedBtn] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      try {
        const res = await fetch(BASE_URL);
        const food_data = await res.json();
        setloading(false);
        setdata(food_data);
        setFilteredData(food_data);
      }
      catch (error) { seterror("Enable to fetch data."); }
    }
    fetchData();
  }, []);

  const searchFood = (e) => {
    const filteredValue = e.target.value;
    setFilteredData(filteredValue);
    if (filteredData === "") {
      setFilteredData(null)
    }
    const filter = data?.filter((val) => val.name.toLowerCase().includes(filteredValue.toLowerCase()));
    setFilteredData(filter);
    console.log(filter);
  }
  const btns = [
    {
      name: 'All',
      type: 'all'
    },
    {
      name: 'Breakfast',
      type: 'breakfast'
    },
    {
      name: 'Lunch',
      type: 'lunch'
    },
    {
      name: 'Dinner',
      type: 'dinner'
    },
  ]
  const filterFood = (type) => {
    if (type === "all") {
      setFilteredData(data);
      setSelectedBtn("all");
      return;
    }
    const filter = data?.filter((food) =>
      food.type.toLowerCase().includes(type.toLowerCase())
    );
    setFilteredData(filter);
    setSelectedBtn(type);
  };

  if (error) return <div>{error}</div>
  if (loading) return <div>Loading.....</div>
  return (
    <Container>
      <TopContainer>
        <div className='logo'>
          <img src='/images/logo.svg' alt="logo" />
        </div>
        <div className="search">
          <input onChange={searchFood} placeholder='Search Food...' />
        </div>
      </TopContainer>

      <FilterContainer>
        {
          btns.map((value) => (
            <Button
              isSelected={selectedBtn === value.type}
              key={value.name}
              onClick={() => filterFood(value.type)}
            >
              {value.name}
            </Button>
          ))
        }
      </FilterContainer>

      <SearchFood data={filteredData} />

    </Container>
  );
}

export default App;

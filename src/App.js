import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSplitBill(e) {
    e.preventDefault();
  }

  function toggleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]); // create new array without efffection old array
    setShowAddFriend((show) => !show);
  }

  function handleSelected(friend) {
    // setSelectedFriend(friend);

    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(bal) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + bal }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelected}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <AddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={toggleShowAddFriend}>
          {showAddFriend === true ? "Close" : "AddFriend"}
        </Button>
      </div>

      {selectedFriend && (
        <SplittBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((el) => {
        return (
          <Friend
            el={el}
            key={el.id}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
}

function Friend({ el, onSelection, selectedFriend }) {
  return (
    <>
      <li className={selectedFriend?.id === el.id ? "selected" : ""}>
        <img src={el.image} alt={el.name} />
        <h3>{el.name}</h3>
        {el.balance < 0 && (
          <p className="red">
            You owe {el.name} ${Math.abs(el.balance)}
          </p>
        )}
        {el.balance > 0 && (
          <p className="green">
            {el.name} owes you ${Math.abs(el.balance)}
          </p>
        )}
        {el.balance === 0 && <p>You and {el.name} are even.</p>}

        <Button onClick={() => onSelection(el)}>
          {selectedFriend?.id === el.id ? "Close" : "Select"}
        </Button>
      </li>
    </>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <div>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🧑‍🤝‍🧑Friend name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
        <label>🌆Image URL</label>{" "}
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </div>
  );
}

function SplittBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const payedByFriend = bill ? bill - userExpense : "";
  const [paying, setPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;
    onSplitBill(paying === "user" ? payedByFriend : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split your bill with {selectedFriend.name}</h2>
      <label>💸Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>💰Your expense</label>{" "}
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? "" : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={payedByFriend} />
      <label>🤑Who is paying?</label>
      <select onChange={(e) => setPaying(e.target.value)} value={paying}>
        <option value={"user"}>You</option>
        <option value={"friend"}>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

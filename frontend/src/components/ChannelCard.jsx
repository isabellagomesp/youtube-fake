function ChannelCard({ user, isSubscribed, onSubscribe }) {
    return (
      <div
        style={{ border: "1px solid gray",padding: 16,marginBottom: 16,}}
      >
        <h3>{user.channelName}</h3>
  
        <p>Dono: {user.name}</p>
  
        <button
          onClick={() => onSubscribe(user.id)}
          disabled={isSubscribed}
        >
          {isSubscribed ? "Inscrito" : "Inscrever-se"}
        </button>
      </div>
    );
  }
  
  export default ChannelCard;
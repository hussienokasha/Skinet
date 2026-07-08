namespace Core.Entities;

public class CartItem
{
    public int ProductId {set ; get;}
    public required string ProductName {set ; get;}
    public required string PictureUrl {set ; get;}
    public required string Brand {set ; get;}
    public  int Quantity {set ; get;}
    public decimal Price { get; set; }
    public required string Type {set ; get;}

}

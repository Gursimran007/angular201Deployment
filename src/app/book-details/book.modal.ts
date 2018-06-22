export class Book {
    ISBN: number;
    authors: string;
    categories: string;
    copies: number;
    description: string;
    id: number;
    imageLinks: string;
    likes: number;
    title: string;
    issued: number;
    taken: Boolean;
    liked: Boolean;
    constructor(ISBN?: number, authors?: string, categories?: string, copies?: number,
        description?: string, id?: number, imageLinks?: string, issued?: number, likes?: number, title?: string) {

        this.ISBN = ISBN;
        this.authors = authors;
        this.categories = categories;
        this.copies = copies;
        this.description = description;
        this.id = id;
        this.imageLinks = imageLinks;
        this.issued = issued;
        this.likes = likes;
        this.title = title;
        this.taken = false;
        this.liked = false;
    }
}

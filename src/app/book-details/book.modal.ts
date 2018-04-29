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

    constructor(ISBN?: number, authors?: string, categories?: string, copies?: number,
        description?: string, id?: number, imageLinks?: string, likes?: number, title?: string) {

        this.ISBN = ISBN;
        this.authors = authors;
        this.categories = categories;
        this.copies = copies;
        this.description = description;
        this.id = id;
        this.imageLinks = imageLinks;
        this.likes = likes;
        this.title = title;
    }
}

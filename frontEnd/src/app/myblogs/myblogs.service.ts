import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import {
  SearchParameter as FetchBlogsParameter,
  blog as blog,
  data,
} from 'src/DataTypes';
import { APIService } from 'src/apiservice.service';

@Injectable({
  providedIn: 'root',
})
export class MyblogsService {
  myblogs: blog[] = [];
  myblogsPage: number = 1;
  myBlogsSearchPage: number = 1;
  parameter: FetchBlogsParameter = {
    page: 1,
    title: '',
  };

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private serviceApi:APIService) {}

  getPosts() {
    this.parameter.page = this.myblogsPage;
    this.parameter.title = '';
    this.fetchMyBlogs(this.parameter).subscribe((response) => {
      if (
        'status' in response &&
        response.status === 'success' &&
        'data' in response
      ) {
        const result: blog[] = (response.data as data).blogs as blog[];
        //console.log(result);
        this.myblogs.length = 0;
        result.forEach((blog) => {
          this.myblogs.push(this.furnishBlog(blog));
        });
      }
    });
  }

  getSearchResult(keyword: string) {
    this.parameter.title = keyword;
    this.parameter.page = this.myBlogsSearchPage;

    this.fetchMyBlogs(this.parameter).subscribe({
      next: (response) => {
        if (
          'status' in response &&
          response.status === 'success' &&
          'data' in response
        ) {
          const blogs: blog[] = (response.data as data).blogs as blog[];
          this.myblogs.length = 0;
          blogs.forEach((blog) => {
            this.myblogs.push(this.furnishBlog(blog));
          });
          //console.log(this.myblogs);
        }
      },
      error: (error) => {
        //console.log(error);
      },
    });
  }

  onIonInfiniteMyBlogs(ev: any) {
    this.myblogsPage++;
    this.parameter.page = this.myblogsPage;
    this.parameter.title = '';

    this.fetchMyBlogs(this.parameter).subscribe((response) => {
      if (
        'status' in response &&
        response.status === 'success' &&
        'data' in response
      ) {
        const moreBlogs: blog[] = (response.data as data).blogs as blog[];
        moreBlogs.forEach((blog) => {
          this.myblogs.push(this.furnishBlog(blog));
        });
      }
    });

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 300);
  }

  onIonInfiniteMyBlogsSearch() {} //Not Implemented

  addNewblog(response: any) {
    const newBlog: newBlog = response.data.post;
    newBlog.firstName = newBlog.user.firstName;
    newBlog.lastName = newBlog.user.lastName;
    this.myblogs.push(this.furnishBlog(newBlog));
  }

  fetchMyBlogs(parameter: FetchBlogsParameter) {
    let baseurl = `${this.serviceApi.url}/api/v1/blogs/getmypost`;
    let params = new HttpParams().set('page', parameter.page.toString());
    if (parameter.title) {
      params = params.append('title', encodeURIComponent(parameter.title));
    }
    if (parameter.subtitle) {
      params = params.append(
        'subtitle',
        encodeURIComponent(parameter.subtitle)
      );
    }
    return this.http.get(baseurl, {
      params,
      withCredentials: true,
    });
  }

  furnishBlog(blog: blog) {
    blog.time = new Date(blog.time).toDateString().toString();
    // Extract the first image URL from post.post_content
    let imageURL = this.extractFirstImageURL(blog.content);
    if (imageURL === null) {
      imageURL = '../../assets/travelImage/no-image.jpg';
    }
    imageURL = (this.sanitizer.bypassSecurityTrustResourceUrl(imageURL) as any)
      .changingThisBreaksApplicationSecurity;
    blog.imageURL = imageURL;

    return blog;
  }

  extractFirstImageURL(postContent: string): string | null {
    const regex = /<img src="(.*?)"/g;
    const match = regex.exec(postContent);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }
}
export interface newBlog {
  content: string;
  id: string;
  title: string;
  subtitle: string;
  time: string;
  firstName: string;
  lastName: string;
  imageURL: string | null;
  user: {
    firstName: string;
    lastName: string;
  };
}

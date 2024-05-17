import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { error } from 'console';
import { Observable } from 'rxjs';
import {
  SearchParameter as FetchBlogsParameter,
  blog as blog,
  data,
} from 'src/DataTypes';

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
    //subtitle : 'W'
  };

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

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
        console.log(result);
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
          this.myblogs = (response.data as data).blogs as blog[];
          this.myblogs.forEach((blog) => {
            this.myblogs.push(this.furnishBlog(blog));
          });
        }
      },
      error: (error) => {
        console.log(error);
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
    const newBlog:blog = response.data.post;
    console.log(newBlog);
    this.myblogs.push(this.furnishBlog(newBlog));
  }

  fetchMyBlogs(parameter: FetchBlogsParameter) {
    let baseurl = 'http://localhost:8081/api/v1/blogs/getmypost';
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

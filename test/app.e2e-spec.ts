import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AppModule } from './../src/app.module';
import { createCard, createCredential, createNote, createUser, initializeFactoryPrisma } from './factory/factories';

describe('AppController (e2e)', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  let service: UsersService;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);
    service = app.get(UsersService);

    await prisma.cards.deleteMany();
    await prisma.credentials.deleteMany();
    await prisma.notes.deleteMany();
    await prisma.users.deleteMany();

    await app.init();
    initializeFactoryPrisma(prisma);
  });

  describe('/health', () => {
    it('get => should return 200 and I`m okay', async () => {
      return await request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('I’m okay!');
    });
  });

  describe('/users', () => {
    describe('post /signup ', () => {
      it('should return 400 when email or password is not sent in body', async () => {
        return await request(app.getHttpServer())
          .post('/users/signup')
          .send({
            
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('it should return 409 when the email is already registered', async () => {
        const user = await createUser();
        return await request(app.getHttpServer())
          .post('/users/signup')
          .send({
            email: user.email,
            password: "LAALALLALALAa7*"
          })
          .expect(HttpStatus.CONFLICT)
      });

      it('should return 201 when registration is successful', async () => {
        const user = await createUser();
        return await request(app.getHttpServer())
          .post('/users/signup')
          .send({
            email: "giovanna@gi.com",
            password: "Giovanna7*"
          })
          .expect(HttpStatus.CREATED);
      });
    });

    describe('post /signin', () => {
      it('should return 401 when user is not authorized', async () => {
        return await request(app.getHttpServer())
          .post('/users/signin')
          .send({
            email: "giovanna@gi.com",
            password: "Giovanna7*"
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

       it('should return 400 when email or password is not sent in body', async () => {
        return await request(app.getHttpServer())
          .post('/users/signin')
          .send({
            
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('it should return 201 when the user succeeds in logging in', async () => {
        const user = await createUser();
        return await request(app.getHttpServer())
          .post('/users/signin')
          .send({
            email: user.email,
            password: 'Giovanna7*'
          })
          .expect(HttpStatus.CREATED);
      })
    });
  });

  describe('/credentials ', () => {
    describe('post /credentials', () => {
      it('should return 401 when token is not valid', async () => {
        return await request(app.getHttpServer())
          .post('/credentials')
          .send({
            Title: "",
            Url: "",
            Username: "",
            Password: ""
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 409 when the user already has a credential with the same title', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const credential = await createCredential(user.id);
        return await request(app.getHttpServer())
          .post('/credentials')
          .set('Authorization', `Bearer ${token.token}`)
          .send({
            title: credential.Title,
            url: "web.whatsapp.com",
            username: "gioptc",
            password: "gigi"
          })
          .expect(HttpStatus.CONFLICT);
      });

      it('should return 201 when credential is successfully created', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .post('/credentials')
          .set('Authorization', `Bearer ${token.token}`)
          .send({
            title: "whatsapp",
            url: "web.whatsapp.com",
            username: "gioptc",
            password: "123"
          })
          .expect(HttpStatus.CREATED);
      })
    });;

    describe('get /credentials', () => {
      it('should return 401 when token is not valid', async () => {
        const user = await createUser();
        return await request(app.getHttpServer())
          .get('/credentials/1')
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 404 when credential does not exist', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .get('/credentials/1')
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return 403 when credential belongs to another user', async () => {
        const user = await createUser();
        const secUser = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const credential = await createCredential(secUser.id);
        return await request(app.getHttpServer())
          .get(`/credentials/${credential.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should return 200 when credential belongs to user', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const credential = await createCredential(user.id);
        return await request(app.getHttpServer())
          .get(`/credentials/${credential.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.OK);
      });

    });

    describe('delete /credentials', () => {

      it('should return 401 when token is not valid', async () => {
        await createUser();
        return await request(app.getHttpServer())
          .delete('/credentials/1')
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 404 when credential does not exist', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .delete('/credentials/1')
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return 403 when credential belongs to another user', async () => {
        const user = await createUser();
        const secUser = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const credential = await createCredential(secUser.id);
        return await request(app.getHttpServer())
          .delete(`/credentials/${credential.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should return 200 when credential belongs to user', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const credential = await createCredential(user.id);
        return await request(app.getHttpServer())
          .delete(`/credentials/${credential.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.OK);
      });
    });
  });

  describe('/notes', () => {
    describe('post /notes', () => {
      it('should return 400 when title or text is not sent in body', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .post(`/notes`)
          .set('Authorization', `Bearer ${token.token}`)
          .send({
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should return 401 when token is not valid', async () => {
        const user = await createUser();
        await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .post(`/notes`)
          .send({
            title: "facebook",
            text: "lorem ipsum"
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 409 when the user already has a note with the same title', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const note = await createNote(user.id);
        return await request(app.getHttpServer())
          .post(`/notes`)
          .set('Authorization', `Bearer ${token.token}`)
          .send({
            title: note.Title,
            text: "lorem ipsum"
          })
          .expect(HttpStatus.CONFLICT);
      });

      it('should return 201 when note is successfully created', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .post('/notes')
          .set('Authorization', `Bearer ${token.token}`)
          .send({
            title: "whatsapp",
            text: "oii"
          })
          .expect(HttpStatus.CREATED);
      })
    });

    describe('get /notes', () => {
      it('should return 401 when token is not valid', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const note = await createNote(user.id);
        return await request(app.getHttpServer())
          .get(`/notes/1`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 403 when notes belongs to another user', async () => {
        const user = await createUser();
        const secUser = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const note = await createNote(secUser.id);
        return await request(app.getHttpServer())
          .get(`/notes/${note.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should return 404 when notes does not exist', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .get(`/notes/1`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return 200 when notes belongs to user', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const note = await createNote(user.id);
        return await request(app.getHttpServer())
          .get(`/notes/${note.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.OK);
      })
    });

    describe('delete /notes', () => {
      it('should return 401 when token is not valid', async () => {
        const user = await createUser();
        const note = await createNote(user.id);
        return await request(app.getHttpServer())
          .delete(`/notes/${note.id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 403 when credential belongs to another user', async () => {
        const user = await createUser();
        const secUser = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const note = await createNote(secUser.id);
        return await request(app.getHttpServer())
          .delete(`/notes/${note.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should return 404 when notes does not exist', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .delete(`/notes/1`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return 200 when notes belongs to user', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        const note = await createNote(user.id);
        return await request(app.getHttpServer())
          .delete(`/notes/${note.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.OK);
      });
    });
  });

  describe('/cards', () => {
    describe('post /cards', () => {
      it('should return 400 when user not sent a body', async () => {
        const user = await createUser();
        const token = await service.login({ email: user.email, password: 'Giovanna7*' });
        return await request(app.getHttpServer())
          .post(`/cards`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should return 401 when token is not valid', async () => {
        const user = await createUser();
        return await request(app.getHttpServer())
          .post(`/cards`)
          .send({
            number: 1604,
            name: "Giovanna Patriarcha",
            cvv: 160,
            date: "16/04",
            password: "1604",
            virtual: true,
            type : "débito",
            title: "mastercard",
            UserId:user.id
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 409 when the user already has a card with the same title', async () => {
        const user = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        const card = await createCard(user.id)
        return await request(app.getHttpServer())
          .post(`/cards`)
          .set('Authorization', `Bearer ${token.token}`)
          .send({
            number: 1604,
            name: "Giovanna Patriarcha",
            cvv: 160,
            date: "16/04",
            password: "1604",
            virtual: true,
            type : "débito",
            title: card.Title,
            UserId:user.id
          })
          .expect(HttpStatus.CONFLICT);
      });

      it('should return 200 when creates a card', async () => {
        const user = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        return await request(app.getHttpServer())
          .post(`/cards`)
          .set('Authorization', `Bearer ${token.token}`)
          .send({
            number: 1604,
            name: "Giovanna Patriarcha",
            cvv: 160,
            date: "16/04",
            password: "1604",
            virtual: true,
            type : "débito",
            title: "mastercard",
            UserId:user.id
          })
          .expect(HttpStatus.CREATED);
      })
    });

    describe('get /card', () => {
      it('should return 401 when token is not valid', async () => {
        const user = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        const note = await createNote(user.id)
        return await request(app.getHttpServer())
          .get(`/cards/1`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return 403 when cards belongs to another user', async () => {
        const user = await createUser()
        const secUser = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        const card = await createCard(secUser.id)
        return await request(app.getHttpServer())
          .get(`/cards/${card.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should return 404 when card does not exist', async () => {
        const user = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        return await request(app.getHttpServer())
          .get(`/cards/1`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return 200 when cards belongs to user', async () => {
        const user = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        const card = await createCard(user.id)
        return await request(app.getHttpServer())
          .get(`/cards/${card.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.OK);
      });
    });

    describe('delete /cards', () => {
      it('should return 401 when token is not valid', async () => {
        const user = await createUser()
        const note = await createNote(user.id)
        return await request(app.getHttpServer())
          .delete(`/cards/${note.id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      })

      it('should return 403 when cards belongs to another user', async () => {
        const user = await createUser()
        const secUser = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        const card = await createCard(secUser.id)
        return await request(app.getHttpServer())
          .delete(`/cards/${card.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should return 404 when card does not exist', async () => {
        const user = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        return await request(app.getHttpServer())
          .delete(`/cards/1`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return 200 when cards belongs to user', async () => {
        const user = await createUser()
        const token = await service.login({ email: user.email, password: 'Giovanna7*' })
        const card = await createCard(user.id)
        return await request(app.getHttpServer())
          .delete(`/cards/${card.id}`)
          .set('Authorization', `Bearer ${token.token}`)
          .expect(HttpStatus.OK);
      })
    });
  });

  describe('post /erase', () => {
    it('401 when password is incorrect', async () => {
      const user = await createUser()
      const token = await service.login({ email: user.email, password: 'Giovanna7*' })
      return await request(app.getHttpServer())
        .post('/erase')
        .set('Authorization', `Bearer ${token.token}`)
        .send({
          password:'quhhueuehhuq'
        })
        .expect(HttpStatus.UNAUTHORIZED);
    })

    it('200 when everything is correct', async () => {
      const user = await createUser()
      const token = await service.login({ email: user.email, password: 'Giovanna7*' })
      return await request(app.getHttpServer())
        .post('/erase')
        .set('Authorization', `Bearer ${token.token}`)
        .send({
          password:'Giovanna7*'
        })
        .expect(HttpStatus.CREATED);
    })
  });
});
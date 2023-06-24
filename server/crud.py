from passlib.hash import bcrypt
from sqlalchemy.orm import Session

from . import models, schemas


def get_languages(db: Session):
    return db.query(models.Language).all()


def create_language(db: Session, language: schemas.LanguageCreate):
    db_language = models.Language(title=language.title)
    db.add(db_language)
    db.commit()
    db.refresh(db_language)
    return db_language


def delete_language(db: Session, language_id: int):
    db.query(models.Language).filter(models.Language.id == language_id).delete()
    db.commit()
    return True


def update_language(db: Session, language_id: int, language: schemas.LanguageCreate):
    db.query(models.Language).filter(models.Language.id == language_id).update(**language.dict())
    db.commit()
    return True


def get_user_by_login(db: Session, user_login: str):
    return db.query(models.User).filter(models.User.login == user_login).first()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        login = user.login,
        password = bcrypt.hash(user.password),
        native_language_id = user.native_language_id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, login: str, password: str):
    db_user = get_user_by_login(db, login)
    if not db_user:
        return False
    if not bcrypt.verify(password, db_user.password):
        return False
    return db_user


def get_topics(db: Session):
    return db.query(models.Topic).all()


def create_topic(db: Session, topic: schemas.TopicCreate):
    db_topic = models.Topic(title=topic.title)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic


def update_topic(db: Session, topic_id: int, topic: schemas.TopicCreate):
    db.query(models.Topic).filter(models.Topic.id == topic_id).update(**topic.dict())
    db.commit()
    return True


def delete_topic(db: Session, topic_id: int):
    db.query(models.Topic).filter(models.Topic.id == topic_id).delete()
    db.commit()
    return True


def get_word(db: Session, word_id: int):
    return db.query(models.Word).filter(models.Word.id == word_id).first()


def create_word(db: Session, word: schemas.WordCreate):
    db_word = models.Word(**word.dict())
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word


def update_word(db: Session, word_id: int, word: schemas.WordCreate):
    db.query(models.Word).filter(models.Word.id == word_id).update(**word.dict())
    db.commit()
    return True


def delete_word(db: Session, word_id: int):
    db.query(models.Word).filter(models.Word.id == word_id).delete()
    db.commit()
    return True

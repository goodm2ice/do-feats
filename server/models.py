from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Language(Base):
    __tablename__ = 'languages'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    native_language_id = Column(Integer, ForeignKey('languages.id'), nullable=True)
    native_language = relationship('Language')


class Topic(Base):
    __tablename__ = 'topics'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)


class Word(Base):
    __tablename__ = 'words'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    pronunciation = Column(String, nullable=False)
    topic_id = Column(Integer, ForeignKey('topics.id'), nullable=True)
    language_id = Column(Integer, ForeignKey('languages.id'), nullable=False)

    language = relationship('Language')
    topic = relationship('Topic')


class Translation(Base):
    __tablename__ = 'translations'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    pronunciation = Column(String, nullable=True, default=None)
    word_id = Column(Integer, ForeignKey('words.id'), nullable=False)
    language_id = Column(Integer, ForeignKey('languages.id'), nullable=False)

    language = relationship('Language')
    word = relationship('Word', cascade='all,delete')
